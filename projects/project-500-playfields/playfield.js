class Playfield {
    constructor(canvasId) {
        this.canvas = document.querySelector(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.objs = [];
    }
    add(obj) {
        obj.playfield = this;
        this.objs.push(obj);
    }
    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let obj of this.objs) obj.draw(this.ctx);
    }
}

class Box {
    constructor(name, color, x, y, w, h) {
        this.name = name;
        this.color = color;
        this.x = x; this.y = y;
        this.w = w; this.h = h;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        ctx.font = '12px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.name, this.x + this.w/2, this.y + this.h/2);

        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
}