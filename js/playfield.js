class Mixin {
    static mixin(mixer) {
        Object.assign(this.prototype, mixer);
        let mixins = this._mixins || [];
        mixins.push(mixer);
        this._mixins = mixins;
    }
    static initialize(obj) {
        let mixins = this._mixins || [];
        for(let mixin of mixins) {
            mixin._initialize(obj);
        }
    }
}

class Playfield extends Mixin {
    constructor(canvasId) {
        super();
        this.canvas = document.querySelector(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.objs = [];
        this.canvas.playfield = this;
        this.selectedObj = null;
        this.canvas.addEventListener('mousedown', this.__handleMouseDown);
        this.canvas.addEventListener('mousemove', this.__handleMouseMove);
        this.canvas.addEventListener('mouseup', this.__handleMouseUp);
        this.dragObj = null;
        this.dragDX = null;
        this.dragDY = null;
        this.body = document.querySelector('body');
        this.body.playfield = this;
        document.addEventListener("keydown", this.__handleKeyDown);
    }
    __handleMouseDown(event) {
        return (event.srcElement.playfield._handleMouseDown(event));
    }
    __handleMouseUp(event) {
        return (event.srcElement.playfield._handleMouseUp(event));
    }
    __handleMouseMove(event) {
        return (event.srcElement.playfield._handleMouseMove(event));
    }
    __handleKeyDown(event) {
        return (event.srcElement.playfield._handleKeyDown(event));
    }
    _findObjInBounds(x, y) {
        for (let i = this.objs.length - 1; i >= 0; i--) {
            let obj = this.objs[i];
            if (obj.inBounds(x, y)) return obj
        }
        return null;
    }
    _handleKeyDown(event) {
        let stopProcessing = false
        for (let i = this.objs.length - 1; i >= 0; i--) {
            let obj = this.objs[i];
            stopProcessing = obj.keydown(event.key, event);
            if (stopProcessing) break;
        }
        if (!stopProcessing) {
            this.keydown(event.key, event);
        }
    }
    _handleMouseDown(event) {
        let stopProcessing = false;
        for (let i = this.objs.length - 1; i >= 0; i--) {
            let obj = this.objs[i];
            if (!obj.inBounds(event.offsetX, event.offsetY)) continue;
            stopProcessing = obj.click(event.offsetX - obj.x, event.offsetY - obj.y, event);
            if (stopProcessing) break;
        }
        if (!stopProcessing) {
            this.click(event.offsetX, event.offsetY, event);
        }
    }
    _handleMouseUp(event) {
        this._dragStop();
    }
    _handleMouseMove(event) {
        this._dragging(event.offsetX - playfield.grabDX, event.offsetY - playfield.grabDY);
    }
    _dragging(x, y) {
        if (this.dragObj) {
            this.dragObj.dragging(x, y);
        }
    }
    _dragStop() {
        if (this.dragObj) {
            this.dragObj.dragStopped();
            this.dragObj = null;
        }
    }
    _timer(playfield) {
        playfield._goAll();
        playfield.redraw();
    }
    _goAll() {
        for (let obj of this.objs) obj.go();
    }
    add(obj) {
        obj.playfield = this;
        this.objs.push(obj);
    }
    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let obj of this.objs) obj.draw(this.ctx);
    }
    dragStart(obj, event) {
        let dx = obj.x;
        let dy = obj.y;
        if (event) {
            dx = event.offsetX;
            dy = event.offsetY;
        }
        this._dragStop();
        this.dragObj = obj;
        this.grabDX = dx - obj.x;
        this.grabDY = dy - obj.y;
        this.dragObj.dragStarted();
    }
    select(obj) {
        if (this.selectedObj) this.selectedObj.deselected();
        this.selectedObj = obj;
        this.selectedObj.selected();
    }
    deselect() {
        if (this.selectedObj) this.selectedObj.deselected();
        this.selectedObj = null;
    }
    toFront(obj) {
        let i = this.objs.indexOf(obj);
        if (i === -1) return;
        this.objs.splice(i, 1);
        this.objs.push(obj);
    }
    toBack(obj) {
        let i = this.objs.indexOf(obj);
        if (i === -1) return;
        this.objs.splice(i, 1);
        this.objs.splice(0, 0, obj);
    }
    start() {
        this.redraw();
        this._timerId = setInterval(this._timer, 125, this);
    }
    stop() {
        if (this._timerId) {
            clearInterval(this._timerId);
            this.redraw();
        }
    }
    collisions(theObj, x = theObj.x, y = theObj.y, w = theObj.w, h = theObj.h) {
        let results = [];
        for (let obj of this.objs) {
            if (theObj === obj) continue;
            if (obj.inBounds(x, y) ||
                obj.inBounds(x + w, y) ||
                obj.inBounds(x, y + h) ||
                obj.inBounds(x + w, y + h))
                results.push(obj);
        }
        return results;
    }
    click(x,y, event) {
        this.deselect();
    }
    keydown(key, event) {
        //
    }
}

class PObject extends Mixin {
    constructor(name, color, x, y, w, h) {
        super();
        this.playfield = null;
        this.name = name;
        this.color = color;
        this.x = x; this.y = y;
        this.w = w; this.h = h;
    }
    toBack() {
        this.playfield.toBack(this);
    }
    toFront() {
        this.playfield.toFront(this);
    }
    inBounds(x, y) {
        let result = _between(this.x, x, this.x + this.w) && _between(this.y, y, this.y + this.h);
        return result;
    }
    dragging(x, y) {
        this.x = x;
        this.y = y;
    }
    selected() { }
    deselected() { }
    click(x, y) { } // abstract method
    dragStarted() { } // abstract method
    dragStopped() { } // abstract method
    draw(ctx) { } // abstract method
    go() { } // abstract method
    keydown(key, event) { } // abstract method
}