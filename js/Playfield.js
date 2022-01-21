/**
 * NOTE: need to change "mousing", "dragging", etc... to "onMouseMove", "onDrag", etc...
 * NOTE: need to change ""
 */

class Playfield extends Mixin {
    _init(args) {
        args = Mixin.getArgs(arguments, { canvasId: String, fullScreen: true });
        this._canvas = document.querySelector(args.canvasId) || document.querySelector("#" + args.canvasId);
        if (!this._canvas) throw Error(`Could not find Canvas='${args.canvasId}' in DOM`);
        this._ctx = this._canvas.getContext('2d');
        this._objs = [];
        this._x = this._canvas.offsetX;
        this._y = this._canvas.offsetX;
        this._w = this._canvas.width;
        this._h = this._canvas.height;
        this._selectedObj = null;
        this._canvas.addEventListener('mousedown', this._handleMouseDown.bind(this));
        this._canvas.addEventListener('mousemove', this._handleMouseMove.bind(this));
        this._canvas.addEventListener('mouseup', this._handleMouseUp.bind(this));
        document.addEventListener("keydown", this._handleKeyDown.bind(this));
        window.onresize = this._handleWindowResize.bind(this);
        this._dragObj = null;
        this._dragDX = null;
        this._dragDY = null;
        this._timerId = null;
        this._fullScreen = args.fullScreen;
        if (this._windowResize) this.resize(0, 0, window.outerWidth, window.outerHeight);
    }
    _handleWindowResize(event) {
        if (this._fullScreen) {
            this.resize();
        }
    }
    _findObjInBounds(x, y) {
        for (let obj of this._objs) {
            if (obj.inBounds(x, y)) return obj
        }
        return null;
    }
    _handleKeyDown(event) {
        let stopProcessing = false
        for (let obj of this._objs) {
            stopProcessing = obj.onKeyDown(event.key, event);
            if (stopProcessing) break;
        }
        if (!stopProcessing) {
            this.onKeyDown(event.key, event);
        }
    }
    _handleMouseDown(event) {
        for (let obj of this._objs) {
            if (obj.inBounds(event.offsetX, event.offsetY)) {
                this._dragStart(obj, event.offsetX, event.offsetY, event);
                break;
            }
        }
        this._dispatchEvent("onClick", event, true);
    }
    _handleMouseUp(event) {
        this._dragStop(event.offsetX, event.offsetY, event);
        this._dispatchEvent("onClickUp", event, true);
    }
    _handleMouseMove(event) {
        this._drag(event.offsetX, event.offsetY, event)
        this._dispatchEvent("onHover", event, true);
    }
    _dispatchEvent(fnName, event, onInBounds) {
        let x = event.offsetX;
        let y = event.offsetY;
        let stopProcessing = false;
        for (let obj of this._objs) {
            if (onInBounds && !obj.inBounds(x, y)) continue;
            let dx = x - obj.x;
            let dy = y - obj.y;
            let fn = obj[fnName].bind(obj);
            stopProcessing = fn(dx, dy, event);
            if (stopProcessing) break;
        }
        return stopProcessing;
    }
    _dispatchAll(fnName, args) {
        let stopProcessing = false;
        for (let obj of this._objs) {
            let fn = obj[fnName].bind(obj);
            stopProcessing = fn(...args);
            if (stopProcessing) break;
        }
        return stopProcessing;
    }
    _timer(playfield) {
        playfield._goAll();
        playfield.redraw();
    }
    _tickAll() {
        for (let obj of this._objs) {
            obj.getTimer();
            obj.onTick();
        }
    }
    _drag(mouseX, mouseY, event) {
        let dx = mouseX - this._dragDX;
        let dy = mouseY - this._dragDY;
        if (this._dragObj) this._dragObj.onDrag(dx, dy, mouseX, mouseY, event);

    }
    _dragStart(obj, mouseX, mouseY, event) {
        this._dragStop(mouseX, mouseY, event);
        this._dragObj = obj;
        this._dragDX = mouseX - obj.x;
        this._dragDY = mouseY - obj.y;
        let dx = mouseX - this._dragDX;
        let dy = mouseY - this._dragDY;
        this._dragObj.onDragStart(dx, dy, mouseX, mouseY, event);
    }
    _dragStop(mouseX, mouseY, event) {
        if (this._dragObj) {
            let dx = mouseX - this._dragDX;
            let dy = mouseY - this._dragDY;
            this._dragObj.onDragStop(dx, dy, mouseX, mouseY, event);
            this._dragObj = null;
        }
    }

    get x() { return this._x; }
    get y() { return this._y; }
    get w() { return this._w; }
    get h() { return this._h; }

    add(obj) {
        obj._playfield = this;
        obj._ctx = this._ctx;
        this._objs.splice(0, 0, obj);
    }
    redraw() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        for (let i = this._objs.length - 1; i >= 0; i--) {
            let obj = this._objs[i];
            if (obj.isVisible) obj.draw(this._ctx);
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
    toFront(obj) {
        let i = this._objs.indexOf(obj);
        if (i === -1) return;
        this._objs.splice(i, 1);
        this._objs.push(obj);
    }
    toBack(obj) {
        let i = this._objs.indexOf(obj);
        if (i === -1) return;
        this._objs.splice(i, 1);
        this._objs.splice(0, 0, obj);
    }
    start(tick = 125) {
        this.redraw();
        this._timerId = setInterval(this._timer.bind(this), tick);
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
        for (let obj of this._objs) {
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
        this._objs = [];
        this.stop();
    }
    resize(x, y, w, h) {
        if (x === undefined) {
            x = 0;
            y = 0;
            w = window.outerWidth;
            h = window.outerHeight;
        }
        this._canvas.x = x;
        this._canvas.y = y;
        this._canvas.width = w;
        this._canvas.height = h;
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
        this._dispatchAll("onResize", [x, y, w, h]);
    }
}

class PObject extends Mixin {
    _defaults = {
        playfield: Playfield,
        name: "",
        color: "black",
        x: 0,
        y: 0,
        w: 100,
        h: 100,
        borderColor: "red"
    };
    _init(args) {
        args = Mixin.getArgs(arguments, this._defaults);
        this._name = args.name;
        this._color = args.color;
        this._borderColor = args.borderColor;
        this._x = args.x; this._y = args.y;
        this._w = args.w; this._h = args.h;
        this._isSelected = false;
        this._isVisible = true;
        this._timer = 0;
        this._callback = null;
        args.playfield.add(this);
    }
    onHover(x, y, mouseX, mouseY, event) { }; // abstract method
    onClick(x, y, mouseX, mouseY, event) { } // abstract method
    onClickUp(x, y, mouseX, mouseY, event) { } // abstract method
    onDrag(x, y, mouseX, mouseY, event) { 
        this.move(mouseX-x, mouseY-y);
    }
    onDragStart(x, y, mouseX, mouseY) { } // abstract method
    onDragStop(x, y, mouseX, mouseY) { } // abstract method
    onTick() { } // abstract method
    onKey(key, event) { } // abstract method
    onResize(x, y, w, h) { }

    get x() { return this._x; }
    get y() { return this._y; }
    get w() { return this._w; }
    get h() { return this._h; }
    get isVisible() { return this._isVisible; }
    toBack() {
        this._playfield.toBack(this);
    }
    toFront() {
        this._playfield.toFront(this);
    }
    hide() {
        this._isVisible = false;
    }
    show() {
        this._isVisible = true;
    }
    inBounds(x, y) {
        let result = _between(this._x, x, this._x + this.w) && _between(this._y, y, this._y + this.h);
        return result;
    }
    setTimer(ms, callback, context) {
        if (ms === 0) {
            this._timer = 0;
        } else {
            let now = new Date().getTime();
            this._timer = now + ms;
            this._callback = callback;
            this._context = context;
        }
    }
    getTimer() {
        if (!this._timer) return 0;
        let now = new Date().getTime();
        let delta = this._timer - now;
        if (delta > 0) return delta;
        this._timer = 0;
        if (this._callback) this._callback(this._context)
        return 0;
    }
    move(x, y) {
        this._x = x;
        this._y = y;
    }
    resize(w, h) {
        this._w = w;
        this._h = h;
    }
    select(on_off) {
        this._isSelected = on_off;
    }
    draw(ctx) { } // abstract method
}