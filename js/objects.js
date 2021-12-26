const Meanderer = {
    Meanderer() { // all mixins must have an init method
        this.dx = random(-10, 10);
        this.dy = random(-10, 10);
    },
    go() {
        if (this.isSelected) return;
        this.x += this.dx;
        this.y += this.dy;

        let collisions = this.playfield.collisions(this);
        if (collisions.length) {
            this.dx = random(-10, 10);
            this.dy = random(-10, 10);
        }

        if (this.x < 0) {
            this.x = 0;
            this.dx = -this.dx;
        }
        if (this.x + this.w > this.playfield.canvas.width) {
            this.x = this.playfield.canvas.width - this.w;
            this.dx = -this.dx;
        }
        if (this.y < 0) {
            this.y = 0;
            this.dy = -this.dy;
        }
        if (this.y + this.h > this.playfield.canvas.height) {
            this.y = this.playfield.canvas.height - this.h;
            this.dy = -this.dy;
        }
    }
}

class Box extends PObject {
    static {
        Box.mixin(Meanderer);
    }
    constructor(name, color, x, y, w, h) {
        super(name, color, x, y, w, h);
        this.Meanderer();
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        ctx.font = '12px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.name, this.x + this.w / 2, this.y + this.h / 2);

        if (this.isSelected) {
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.w, this.h);
        }
    }
}
