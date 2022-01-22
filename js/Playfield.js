/**
 * NOTE: need to change "mousing", "dragging", etc... to "onMouseMove", "onDrag", etc...
 * NOTE: need to change ""
 */

Node = {
    Node() {
        this._parent = null;
        this._children = [];
    },
    getParent() { return this._parent; },
    addChild(child, n) {
        if (child) {
            if (n !== undefined) this._children.splice(n, 0, child);
            else this._children.push(child);
        }
    },
    getChildren() {
        return this._children.slice(0); // clone of array
    },
    removeChild(obj) {
        let oldChild = null;
        if (typeof obj === "number") {
            if (this._children.length > n) oldChild = this._children.splice(obj, 1);
        } else {
            let i = this._children.indexOf(obj);
            if (i >= 0) oldChild = this._children.splice(i, 1);
        }
        return oldChild;
    },
    emptyChildren() {
        let children = this._children;
        this._children = [];
        return children;
    }
}

class Playfield extends Mixin {
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
        this._tick = args.tick;
        this._fullScreen = args.fullScreen;
        this._dWidth = 20;
        this._dHeight = 20;
        this._resizeHysterisis = 125;
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
    _handleWindowResize(event) {
        if (this._fullScreen) {
            this.resize();
        }
    }
    _handleKeyDown(event) {
        event.stopPropagation();
        let stopProcessing = false
        for (let obj of this.getChildren()) {
            stopProcessing = obj.onKeyDown(event.key, event);
            if (stopProcessing) break;
        }
    }
    _handleMouseDown(event) {
        event.stopPropagation();
        if (event.button === 0) {
            this._dispatchEvent("onClick", event, this.getChildren().reverse());
        } else if (event.button === 2) {
            this._dispatchEvent("onMenu", event, this.getChildren().reverse());
        }
    }
    _handleMouseUp(event) {
        event.stopPropagation();
        if (event.button === 0) {
            this.dragStop(event);
            this._dispatchEvent("onClickUp", event, this.getChildren().reverse());
        } else if (event.button === 2) {
            this._dispatchEvent("onMenuUp", event, this.getChildren().reverse());
        }
    }
    _handleMouseMove(event) {
        event.stopPropagation();
        this._drag(event)
        this._dispatchEvent("onHover", event, this.getChildren().reverse());
    }
    _dispatchEvent(fnName, event, children, allObjects = false) {
        let x = event.offsetX;
        let y = event.offsetY;
        let processed = false;
        for (let obj of children) {
            if (!obj.inBounds(x, y)) continue;
            let dx = x - obj.x;
            let dy = y - obj.y;
            let fn = obj[fnName].bind(obj);
            let keepGoing = fn(dx, dy, x, y, event);
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
        if (this._dragObj) {
            let mouseX = event.offsetX;
            let mouseY = event.offsetY;
            let dx = mouseX - this._dragDX;
            let dy = mouseY - this._dragDY;
            this._dragObj.onDrag(dx, dy, mouseX, mouseY, event);
        }
    }
    dragStart(obj, event) {
        this.dragStop(event);
        let mouseX = event.offsetX;
        let mouseY = event.offsetY;
        this._dragObj = obj;
        this._dragDX = mouseX - obj.x;
        this._dragDY = mouseY - obj.y;
    }
    dragStop(event) {
        if (event && this._dragObj) {
            let mouseX = event.offsetX;
            let mouseY = event.offsetY;
            let dx = mouseX - this._dragDX;
            let dy = mouseY - this._dragDY;
            this._dragObj.onDragStop(dx, dy, mouseX, mouseY, event);
        }
        this._dragObj = null;
    }

    get x() { return this._x; }
    get y() { return this._y; }
    get w() { return this._w; }
    get h() { return this._h; }

    get X0() { return this._x; }
    get Y0() { return this._y; }
    get X1() { return this.x + this.w; }
    get Y1() { return this.y + this.h; }
    get W() { return this._w; }
    get H() { return this._h; }

    add(obj) {
        obj._ctx = this._ctx;
        this.addChild(obj);
    }
    redraw() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        for (let obj of this.getChildren()) {
            console.log(obj._name, obj.x, obj.y, obj.w, obj.h)
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
        this.redraw();
    }
}

class PObject extends Mixin {
    static {
        Mixin.mixin({ Node });
    }
    _defaults = {
    };
    _init(args) {
        args = Mixin.getArgs(arguments, { parent: Node, name: "", color: "black", x: 0, y: 0, w: 100, h: 100, borderColor: "red", isDraggable: false });
        this._parent = args.parent;
        this._name = args.name;
        this._color = args.color;
        this._borderColor = args.borderColor;
        this._x = args.x; this._y = args.y;
        this._w = args.w; this._h = args.h;
        this._isSelected = false;
        this._isVisible = true;
        this._isDraggable = args.isDraggable;
        this._timer = 0;
        this._callback = null;
        args.parent.add(this);
    }
    onHover(x, y, mouseX, mouseY, event) { }; // abstract method
    onClick(x, y, mouseX, mouseY, event) { } // abstract method
    onClickUp(x, y, mouseX, mouseY, event) { } // abstract method
    onMenu(x, y, mouseX, mouseY, event) { } // abstracte method
    onMenuUp(x, y, mouseX, mouseY, event) { } // abstracte method
    onDrag(x, y, mouseX, mouseY, event) {
        this.move(x, y);
        this.getParent().redraw();
    }
    onDragStop(x, y, mouseX, mouseY) { } // abstract method
    onTick() { } // abstract method
    onKeyDown(key, event) { } // abstract method
    onResize(x, y, w, h) { }
    onDraw(ctx) { } // abstract method

    get x() { return this._x; }
    get y() { return this._y; }
    get x0() { return this._x; }
    get y0() { return this._y; }
    get x1() { return this.x0 + this.w; }
    get y1() { return this.y0 + this.h; }
    get w() { return this._w; }
    get h() { return this._h; }

    get X0() { return this._x + this._parent.X0; }
    get Y0() { return this._y + this._parent.Y0; }
    get X1() { return this.X0 + this._w; }
    get X1() { return this.Y0 + this._h; }
    get W() { return this._w; }
    get H() { return this._h; }

    get isVisible() { return this._isVisible; }
    dragStart(event) {
        this.getPlayfield().dragStart(this, event);
    }
    toBack() {
        this.getParent().toBack(this);
    }
    toFront() {
        this.getParent().toFront(this);
    }
    hide() {
        this._isVisible = false;
    }
    show() {
        this._isVisible = true;
    }
    inBounds(x, y) {
        let result = _between(this.x0, x, this.x1) && _between(this.y0, y, this.y1);
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
    getPlayfield() {
        let playfield = this.getParent();
        while(playfield.getParent()) playfield = this.getParent();
        return playfield;
    }
    move(x, y, w, h) {
        this._x = x;
        this._y = y;
        if (w !== undefined) this._w = w;
        if (h !== undefined) this._h = h;
    }
    resize(w, h, x, y) {
        this._w = w;
        this._h = h;
        if (x !== undefined) this._x = x;
        if (y !== undefined) this._y = y;
    }
    select(on_off) {
        this._isSelected = on_off;
    }
    redraw() {
        this.getParent().redraw();
    }
    add(child) {
        this.addChild(child);
    }
}