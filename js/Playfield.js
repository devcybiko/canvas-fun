class Playfield extends Rect {
    static {
        Mixin.mixin({ Node })
    }
    static CONTINUE = "continue";
    static BREAK = "break";

    _init(args) {
        args = Mixin.getArgs(arguments, { canvasId: String, tick: 125, fullScreen: true });
        this._canvas = document.querySelector(args.canvasId) || document.querySelector("#" + args.canvasId);
        if (!this._canvas) throw Error(`Could not find Canvas='${args.canvasId}' in DOM`);
        this._ctx = this._canvas.getContext('2d');
        this._x = this._canvas.offsetX;
        this._y = this._canvas.offsetY;
        this._w = this._canvas.width;
        this._h = this._canvas.height;
        this._selectedObj = null;
        this._canvas.addEventListener('mousedown', this._handleMouseDown.bind(this));
        this._canvas.addEventListener('mousemove', this._handleMouseMove.bind(this));
        this._canvas.addEventListener('mouseup', this._handleMouseUp.bind(this));
        document.addEventListener("keydown", this._handleKeyDown.bind(this));
        window.onresize = this._handleWindowResize.bind(this);
        this._dragObj = { obj: null, X: 0, Y: 0 };
        this._timerId = null;
        this._tick = args.tick;
        this._fullScreen = args.fullScreen;
        this._dWidth = 20;
        this._dHeight = 20;
        this._resizeHysterisis = 12;
        this._resizeTimerId = null;
        if (this._fullScreen) this.resize(0, 0, window.innerWidth, window.innerHeight);
        this._canvas.oncontextmenu = function (e) { e.preventDefault(); e.stopPropagation(); }
    }
    _findObjInBounds(x, y) {
        for (let obj of this.getChildren()) {
            if (obj.inBounds(x, y)) return obj
        }
        return null;
    }
    _updateEvent(event) {
        event.playfieldX = event.offsetX;
        event.playfieldY = event.offsetY;
    }
    _handleWindowResize(event) {
        if (this._fullScreen) {
            this._updateEvent(event);
            this.resize();
            this.redraw();
        }
    }
    _handleKeyDown(event) {
        event.stopPropagation();
        this._updateEvent(event);
        let stopProcessing = false
        for (let obj of this.getChildren()) {
            stopProcessing = obj.onKeyDown(event.key, event);
            if (stopProcessing) break;
        }
        this.redraw();
    }
    _handleMouseDown(event) {
        event.stopPropagation();
        this._updateEvent(event);
        if (event.button === 0) {
            this._dispatchArgs("_onClickDown", [event], this.getChildren().reverse());
        } else if (event.button === 2) {
            this._dispatchEvent("onMenu", event, this.getChildren().reverse());
        }
        this.redraw();
    }
    _handleMouseUp(event) {
        event.stopPropagation();
        this._updateEvent(event);
        if (event.button === 0) {
            this.dragStop(event);
            this._dispatchEvent("_onClickUp", event, this.getChildren().reverse());
        } else if (event.button === 2) {
            this._dispatchEvent("_onMenuUp", event, this.getChildren().reverse());
        }
        this.redraw();
    }
    _handleMouseMove(event) {
        event.stopPropagation();
        this._updateEvent(event);
        this._drag(event)
        this._dispatchArgs("_onMotion", [event], this.getChildren().reverse());
        // this.redraw();
    }
    _dispatchEvent(fnName, event, children, allObjects = false) {
        let x = event.playfieldX;
        let y = event.playfieldY;
        let processed = false;
        for (let obj of children) {
            if (!obj.inBounds(x, y)) continue;
            let dx = x - obj.x;
            let dy = y - obj.y;
            let fn = obj[fnName].bind(obj);
            let keepGoing = fn(dx, dy, event);
            processed = true;
            if (keepGoing) continue;
            if (!allObjects) break;
        }
        return processed;
    }
    _dispatchArgs(fnName, args, children) {
        for (let obj of children) {
            let fn = obj[fnName].bind(obj);
            let stop = fn(...args);
            if (stop) break;
        }
    }
    _timer() {
        this._tickAll();
        this.redraw();
    }
    _tickAll() {
        for (let obj of this.getChildren()) {
            obj.getTimer();
            obj.onTick();
        }
    }
    _drag(event) {
        if (this._dragObj.obj) {
            let dx = event.playfieldX - this._dragObj.X;
            let dy = event.playfieldY - this._dragObj.Y;
            this._dragObj.obj.onDrag(dx, dy, event);
        }
    }
    dragStart(obj, event) {
        this.dragStop(event);
        this._dragObj = { obj: obj, X: event.playfieldX, Y: event.playfieldY };
        obj._isDragging = true;
    }
    dragStop(event) {
        if (event && this._dragObj.obj) {
            let dx = event.playfieldX - this._dragObj.X;
            let dy = event.playfieldY - this._dragObj.Y;
            this._dragObj.obj.onDragStop(dx, dy, event);
            this._dragObj.obj._isDragging = false;
        }
        this._dragObj.obj = null;
    }

    add(obj) {
        console.log(obj);
        if (!obj._sealed_) throw new Error(obj.constructor.name + ": You must only add Playfield objects outside of the _init() method")
        obj._ctx = this._ctx;
        this.addChild(obj);
    }
    redraw() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        for (let obj of this.getChildren()) {
            if (obj.isVisible) obj.onDraw(this._ctx);
        }
    }
    select(obj) {
        if (obj) {
            if (this._selectedObj) this._selectedObj.select(false);
            this._selectedObj = obj;
            this._selectedObj.select(true);
        } else {
            if (this._selectedObj) this._selectedObj.select(false);
            this._selectedObj = null;
        }
    }
    toBack(obj) {
        this.removeChild(obj);
        this.addChild(obj, 0);
    }
    toFront(obj) {
        this.removeChild(obj);
        this.addChild(obj);
    }
    start(tick) {
        this.redraw();
        this._timerId = setInterval(this._timer.bind(this), tick || this._tick);
    }
    stop() {
        if (this._timerId) {
            clearInterval(this._timerId);
            this.redraw();
        }
        this._timerId = 0;
    }
    collisions(theObj, x = theObj.x, y = theObj.y, w = theObj.w, h = theObj.h) {
        let results = [];
        for (let obj of this.getChildren()) {
            if (theObj === obj) continue;
            if (obj.inBounds(x, y) ||
                obj.inBounds(x + w, y) ||
                obj.inBounds(x, y + h) ||
                obj.inBounds(x + w, y + h))
                results.push(obj);
        }
        return results;
    }
    reset() {
        this.emptyChildren();
        this.stop();
    }
    resize(x, y, w, h) {
        if (x === undefined) { // broser resized
            if (this._resizeTimerId) clearTimeout(this._resizeTimerId);
            this._resizeTimerId = setTimeout(this.resize.bind(this), this._resizeHysterisis, 0, 0, window.innerWidth, window.innerHeight);
            return;
        }
        this._resizeTimerId = null;
        this._x = this._canvas.x = x;
        this._y = this._canvas.y = y;
        this._w = this._canvas.width = w - this._dWidth;
        this._h = this._canvas.height = h - this._dHeight;
        this._dispatchArgs("onResize", [this.x, this.y, this.w, this.h], this.getChildren());
    }
}