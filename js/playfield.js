class Playfield extends Mixin {
    _init(args) {
        args = Mixin.getArgs(arguments, {canvasId:String});
        this._canvas = document.querySelector(args.canvasId);
        if (!this._canvas) {
            this._canvas = document.querySelector("#" + args.canvasId);
            if (!this._canvas) throw Error(`Could not find Canvas='${args.canvasId}' in DOM`);
        }
        this._ctx = this._canvas.getContext('2d');
        this._objs = [];
        this._canvas._playfield = this;
        this._x = 0;
        this._y = 0;
        this._w = this._canvas.width;
        this._h = this._canvas.height;
        this._selectedObj = null;
        this._canvas.addEventListener('mousedown', this.__handleMouseDown);
        this._canvas.addEventListener('mousemove', this.__handleMouseMove);
        this._canvas.addEventListener('mouseup', this.__handleMouseUp);
        this._dragObj = null;
        this._dragDX = null;
        this._dragDY = null;
        this._body = document.querySelector('body');
        this._body._playfield = this;
        document.addEventListener("keydown", this.__handleKeyDown);
        this._timerId = null;
    }
    __handleMouseDown(event) {
        return (event.srcElement._playfield._handleMouseDown(event));
    }
    __handleMouseUp(event) {
        return (event.srcElement._playfield._handleMouseUp(event));
    }
    __handleMouseMove(event) {
        return (event.srcElement._playfield._handleMouseMove(event));
    }
    __handleKeyDown(event) {
        return (event.srcElement._playfield._handleKeyDown(event));
    }
    _findObjInBounds(x, y) {
        for (let i = this._objs.length - 1; i >= 0; i--) {
            let obj = this._objs[i];
            if (obj.inBounds(x, y)) return obj
        }
        return null;
    }
    _handleKeyDown(event) {
        let stopProcessing = false
        for (let i = this._objs.length - 1; i >= 0; i--) {
            let obj = this._objs[i];
            stopProcessing = obj.keydown(event.key, event);
            if (stopProcessing) break;
        }
        if (!stopProcessing) {
            this.keydown(event.key, event);
        }
    }
    _handleMouseDown(event) {
        let stopProcessing = false;
        for (let i = this._objs.length - 1; i >= 0; i--) {
            let obj = this._objs[i];
            if (!obj.inBounds(event.offsetX, event.offsetY)) continue;
            stopProcessing = obj.click(event.offsetX - obj._x, event.offsetY - obj._y, event);
            if (stopProcessing) break;
        }
        if (!stopProcessing) {
            this.click(event.offsetX, event.offsetY, event);
        }
    }
    _handleMouseUp(event) {
        this.dragStop();
    }
    _handleMouseMove(event) {
        this._dragging(event.offsetX - this._dragDX, event.offsetY - this._dragDY, event);
        this._mousing(event.offsetX - this._dragDX, event.offsetY - this._dragDY, event);
    }
    _dragging(x, y) {
        if (this._dragObj) {
            this._dragObj.dragging(x, y);
        }
    }
    _timer(playfield) {
        playfield._goAll();
        playfield.redraw();
    }
    _goAll() {
        for (let obj of this._objs) {
            obj.getTimer();
            obj.go();
        }
    }
    _mousing(x, y, event) {
        let stopProcessing = false;
        for (let i = this._objs.length - 1; i >= 0; i--) {
            let obj = this._objs[i];
            if (!obj.inBounds(event.offsetX, event.offsetY)) continue;
            stopProcessing = obj.mousing(event.offsetX - obj._x, event.offsetY - obj._y, event);
            if (stopProcessing) break;
        }
        if (!stopProcessing) {
            this.mousing(event.offsetX, event.offsetY, event);
        }
    }

    get x() {return this._x;}
    get y() {return this._y;}
    get w() {return this._w;}
    get h() {return this._h;}

    add(obj) {
        obj._playfield = this;
        this._objs.push(obj);
    }
    redraw() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        for (let obj of this._objs) {
            if (obj.isVisible) obj.draw(this._ctx);
        }
    }
    dragStart(obj, event) {
        let dx = obj._x;
        let dy = obj._y;
        if (event) {
            dx = event.offsetX;
            dy = event.offsetY;
        }
        this._dragStop();
        this._dragObj = obj;
        this._dragDX = dx - obj._x;
        this._dragDY = dy - obj._y;
        this._dragObj.dragStarted();
    }
    dragStop() {
        if (this._dragObj) {
            this._dragObj.dragStopped();
            this._dragObj = null;
        }
    }
    select(obj) {
        if (this._selectedObj) this._selectedObj.deselected();
        this._selectedObj = obj;
        this._selectedObj.selected();
    }
    deselect() {
        if (this._selectedObj) this._selectedObj.deselected();
        this._selectedObj = null;
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
    start(tick=125) {
        this.redraw();
        this._timerId = setInterval(this._timer, tick, this);
    }
    stop() {
        if (this._timerId) {
            clearInterval(this._timerId);
            this.redraw();
        }
    }
    collisions(theObj, x = theObj._x, y = theObj._y, w = theObj.w, h = theObj.h) {
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
    click(x, y, event) {
        this.deselect();
    }
    keydown(key, event) {
    }
    mousing(x, y, event) {} // abstract method
}

class PObject extends Mixin {
    _defaults = {
        playfield:Playfield,
        name: "",
        color: "black",
        x: 0,
        y: 0,
        w: 100,
        h: 100};
    _init(args) {
        args = Mixin.getArgs(arguments, this._defaults);
        this._name = args.name;
        this._color = args.color;
        this._x = args.x; this._y = args.y;
        this._w = args.w; this._h = args.h;
        this._isSelected = false;
        this._isVisible = true;
        this._timer = 0;
        this._callback = null;
        args.playfield.add(this);
    }
    get x() { return this._x;}
    get y() { return this._y;}
    get w() { return this._w;}
    get h() { return this._h;}
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
    dragging(x, y, event) {
        move(x,y);
    }
    move(x, y) {
        this._x = x;
        this._y = y;
    }
    selected() { 
        this._isSelected = true;
    }
    deselected() { 
        this._isSelected = false;
    }
    mousing(x, y, event) {}; // abstract method
    click(x, y, event) { } // abstract method
    dragStarted() { } // abstract method
    dragStopped() { } // abstract method
    draw(ctx) { } // abstract method
    go() { } // abstract method
    keydown(key, event) { } // abstract method
}