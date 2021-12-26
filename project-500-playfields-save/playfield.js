
class Playfield {
    constructor(canvasId) {
        this.body = document.querySelector('body');
        this.canvas = document.querySelector(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.objs = [];
        this.canvas.playfield = this;
        this.body.playfield = this;
        document.addEventListener("keydown", this.handleKeyDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.selectedObj = null;
        this.dragObj = null;
        this.dragDX = null;
        this.dragDY = null;
    }
    handleKeyDown(event) {
        _log(event.key);
    }
    handleMouseMove(event) {
        let playfield = event.srcElement.playfield;
        if (!playfield) return _error("ERROR: mousemove not associated with a playfield");
        if (playfield.dragObj) {
            playfield.dragObj.drag(event.offsetX - playfield.grabDX, event.offsetY - playfield.grabDY);
            playfield.redraw();
        }
    }
    _findObjInBounds(x, y) {
        for(let i=this.objs.length -1; i>=0; i--) {
            let obj = this.objs[i];
            if (obj.inBounds(x, y)) return obj
        }
        return null;
    }
    _deselect() {
        if (this.selectedObj) this.selectedObj.deselect();
        this.selectedObj = null;
        return null
    }
    _select(obj) {
        this._deselect()
        this.selectedObj = obj;
        obj.select();
    }
    _grab(obj) {
        if (obj.isDraggable) {
            this.dragObj = obj;
            this.grabDX = event.offsetX - obj.x;
            this.grabDY = event.offsetY - obj.y;
        }
    }
    handleMouseDown(event) {
        _log({ event });
        let playfield = event.srcElement.playfield;
        if (!playfield) return _error("ERROR: mousedown not associated with a playfield");
        let obj = playfield._findObjInBounds(event.offsetX, event.offsetY);
        if (!obj) return playfield._deselect();
        playfield._select(obj);
        playfield._grab(obj);
    }
    handleMouseUp(event) {
        _log({ event });
        let playfield = event.srcElement.playfield;
        if (!playfield) return _error("ERROR: mouseup not associated with a playfield");
        playfield.dragObj = null;
    }
    add(obj) {
        obj.playfield = this;
        this.objs.push(obj);
    }
    goAll() {
        for (let obj of this.objs) obj.go();
    }
    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let obj of this.objs) obj.draw(this.ctx);
    }
    timer() {
        // playfield.moveAll();
        playfield.redraw();
    }
    start() {
        this.redraw();
        setInterval(this.timer, 125);
    }
}

class PObject {
    constructor(name, color, x, y, w, h) {
        this.parent = null;
        this.name = name;
        this.color = color;
        this.x = x; this.y = y;
        this.w = w; this.h = h;
        this.isDraggable = true;
        this.isSelected = false;
    }
    keypress(key) {
        _log("key", this.name, key);
    }
    inBounds(x, y) {
        let result = this.between(this.x, x, this.x + this.w) && this.between(this.y, y, this.y + this.h);
        // _log("inBounds", x, y, result);
        return result;
    }   
    click(x,y) {
    }
    unclick(x,y) {
        // _log("unclick", this.name, x, y);
        this.drag = false;
    }
    drag(x,y) {
        _log("drag", this.name, x, y);
        this.x = x;
        this.y = y;
    }
    select() {
        this.isSelected = true;
    }
    deselect() {
        this.isSelected = false;
    }
    go() {} //abstract method
    draw() {} // abstract method
}

class Box extends PObject {
    constructor(name, color, x, y, w, h) {
        super(name, color, x, y, w, h);
        this.isDraggable = true;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'black';
        ctx.fillRect(this.x, this.y, this.w, this.h);
        if (this.isSelected) ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
}
class GoBox extends Box {
    constructor(name, color, x, y, w, h, dx, dy, draggable = true) {
        super(name, color, x, y, w, h);
        this.dx = dx; this.dy = dy;
        this.isDraggable = draggable
    }
    go() {
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;
    }
}