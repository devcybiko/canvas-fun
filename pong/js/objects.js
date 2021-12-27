const MOVE_Y = 10;

class Paddle extends PObject {
    static {
    }
    constructor(name, color, x, y, w, h) {
        super(name, color, x, y, w, h);
    }
    redraw() {
        this.playfield.redraw();
    }
    adjust() {
        if (this.y < MOVE_Y) this.y = MOVE_Y;
        if (this.y >= this.playfield.canvas.height - this.h) this.y = this.playfield.canvas.height - this.h - MOVE_Y;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
}

class LeftPaddle extends Paddle {
    constructor(name, color, x, y, w, h) {
        super(name, color, x, y, w, h);
    }
    moving(x, y, event) {
        this.y = y;
        this.adjust();
    }
    keydown(key) {
        if (key === "w") this.y -= 10;
        if (key === "s") this.y += 10;
        this.adjust();
    }
}

class RightPaddle extends Paddle {
    constructor(name, color, x, y, w, h) {
        super(name, color, x, y, w, h);
    }
    moving(x, y, event) {
        this.y = y;
        this.adjust();
    }
    keydown(key) {
        if (key === "i") this.y -= 10;
        if (key === "k") this.y += 10;
        this.adjust();
    }
}

class PongPlayfield extends Playfield {
    constructor(id) {
        super(id);
        this.leftPaddle;
        this.rightPaddle;
    }
    moving(x, y, event) {
        this.leftPaddle.moving(x,y,event);
    }
    handleKeyDown(event) {
        let that = event.srcElement.playfield;
        for (let obj of that.objs) {
            obj.keydown(event.key);
            obj.keydown(event.key);
        }
    }
}

class Ball extends Paddle {
    constructor(name, color, x, y, w, h) {
        super(name, color, x, y, w, h);
        this.dx = -10;
        this.dy = +10;
    }
    go() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x > this.playfield.canvas.width) {
            // this.playfield.stop();
            this.dx = - this.dx;
        }
        if (this.x < -this.w) {
            // this.playfield.stop();
            this.dx = - this.dx;
        }
        if (this.y < MOVE_Y) this.dy = -this.dy;
        if (this.y > this.playfield.canvas.height - this.h - MOVE_Y) this.dy = -this.dy
        // let collisions = this.playfield.collisions(this, this.x + this.dx, this.y + this.dy);
        let collisions = this.playfield.collisions(this, this.x + this.dx);
        if (collisions.length) this.dx = -this.dx;
        this.playfield.rightPaddle.moving(this.x, this.y - this.h / 2);
    }
}
