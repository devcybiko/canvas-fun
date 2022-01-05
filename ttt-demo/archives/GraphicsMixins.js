const GraphicsMixin = {
    GraphicsMixin(obj) {
        obj.foo = "FOO";
    },
    box(ctx, color, x, y, w, h) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    },
    border(ctx, color, x, y, w, h) {
        ctx.strokeStyle = color;
        ctx.strokeRect(x, y, w, h);
    },
    borderBox(ctx, borderColor, fillColor, x, y, w, h) {
        this.box(ctx, fillColor, x, y, w, h);
        this.border(ctx, borderColor, x, y, w, h);
    },
    line(ctx, color, x0, y0, x1, y1) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    },
    circle(ctx, color, x, y, r) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.ellipse(x + r, y + r, r, r, 0, 0, 2 * Math.PI);
        ctx.stroke();
    },
    text(ctx, msg, color, x, y, w, h) {
        ctx.font = '12px sans-serif';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(msg, x + w / 2, y + h / 2);
    },
    borderText(ctx, msg, borderColor, fillColor, textColor, x, y, w, h) {
        this.borderBox(ctx, borderColor, fillColor, x, y, w, h);
        this.text(ctx, msg, textColor, x, y, w, h);
    }
}

const LoggingMixin = {
    LoggingMixin(obj) {
        obj.foo = "BAR";
    },
    log(msg) {
        console.log("LoggingMixin::log", this.foo, msg);
    }
}
