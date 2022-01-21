/**
 * NOTE: need to change "mousing", "dragging", etc... to "onMouseMove", "onDrag", etc...
 * NOTE: need to change ""
 */

class Playfield extends Mixin {
    _init(args) {
        args = Mixin.getArgs(arguments, {canvasId:String});
        this._canvas = document.querySelector(args.canvasId) || document.querySelector("#" + args.canvasId);
        if (!this._canvas) throw Error(`Could not find Canvas='${args.canvasId}' in DOM`);
        this._ctx = this._canvas.getContext('2d');
        this._objs = [];
        this._x = 0;
        this._y = 0;
        this._w = this._canvas.width;
        this._h = this._canvas.height;
        this._selectedObj = null;
        this._canvas.addEventListener('mousedown', this._handleMouseDown.bind(this));
        this._canvas.addEventListener('mousemove', this._handleMouseMove.bind(this));
        this._canvas.addEventListener('mouseup', this._handleMouseUp.bind(this));
        document.addEventListener("keydown", this._handleKeyDown.bind(this));
        this._dragObj = null;
        this._dragDX = null;
        this._dragDY = null;
        this._timerId = null;
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
        let stopProcessing = false;
        for (let obj of this._objs) {
            if (!obj.inBounds(event.offsetX, event.offsetY)) continue;
            stopProcessing = obj.onClick(event.offsetX - obj.x, event.offsetY - obj.y, event);
            if (stopProcessing) break;
        }
        if (!stopProcessing) {
            this.onClick(event.offsetX, event.offsetY, event);
        }
    }
    _handleMouseUp(event) {
        this._dragStop();
    }
    _handleMouseMove(event) {
        this._onDrag(event.offsetX - this._dragDX, event.offsetY - this._dragDY, event);
        this._onMove(event.offsetX - this._dragDX, event.offsetY - this._dragDY, event);
    }
    _onDrag(x, y) {
        if (this._dragObj) this._dragObj.onDrag(x, y);
    }
    _onMove(x, y, event) {
        let stopProcessing = false;
        for (let obj of this._objs) {
            if (!obj.inBounds(event.offsetX, event.offsetY)) continue;
            stopProcessing = obj.onHover(event.offsetX - obj._x, event.offsetY - obj._y, event);
            if (stopProcessing) break;
        }
        if (!stopProcessing) {
            this.onHover(event.offsetX, event.offsetY, event);
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

    get x() {return this._x;}
    get y() {return this._y;}
    get w() {return this._w;}
    get h() {return this._h;}

    add(obj) {
        obj._playfield = this;
        this._objs.splice(0, 0, obj);
    }
    redraw() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        for (let i=this._objs.length - 1; i>=0; i--) {
            let obj = this._objs[i];
            if (obj.isVisible) obj.draw(this._ctx);
        }
    }
    _dragStart(obj, event) {
        let dx = obj.x;
        let dy = obj.y;
        if (event) {
            dx = event.offsetX;
            dy = event.offsetY;
        }
        this._dragStop();
        this._dragObj = obj;
        this._dragDX = dx - obj.x;
        this._dragDY = dy - obj.y;
        this._dragObj.onDragStart();
    }
    _dragStop() {
        if (this._dragObj) {
            this._dragObj.onDragStop();
            this._dragObj = null;
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
    start(tick=125) {
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
    onClick(x, y, event) {
        this.select(null);
    }
    onKeyDown(key, event) {
    }
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
    onDrag(x, y, event) {
        move(x,y);
    }
    move(x, y) {
        this._x = x;
        this._y = y;
    }
    onSelect(on_off) { 
        this._isSelected = on_off;
    }
    onMouse(x, y, event) {}; // abstract method
    onClick(x, y, event) { } // abstract method
    onDragStart() { } // abstract method
    onDragStop() { } // abstract method
    onTick() { } // abstract method
    onKey(key, event) { } // abstract method
    draw(ctx) { } // abstract method
}