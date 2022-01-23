const GraphicsMixin = {
    GraphicsMixin(obj) {
        this._color = "black";
        this._fillColor = "white";
        this._borderColor = "red";
        this._font = "sans-serif";
        this._pitch = 12;
        this._textAlign = "center";
        this._textBaseline = "middle";
    },
    rect(args) {
        let defaults = { x: Number, y: Number, w: Number, h: Number, color: this._color || "black", fillColor: this._fillColor || "" };
        args = Mixin.getArgs(arguments, defaults);
        if (args.fillColor) {
            this._ctx.fillStyle = args.fillColor;
            this._ctx.fillRect(args.x, args.y, args.w, args.h);
        }
        if (args.color.length) {
            this._ctx.strokeStyle = args.color;
            this._ctx.strokeRect(args.x, args.y, args.w, args.h);
        }
    },
    line(args) {
        let defaults = { x0: Number, y0: Number, x1: Number, y1: Number, color: this._color || "black" };
        args = Mixin.getArgs(arguments, defaults);
        this._ctx.beginPath();
        this._ctx.strokeStyle = args.color;
        this._ctx.moveTo(args.x0, args.y0);
        this._ctx.lineTo(args.x1, args.y1);
        this._ctx.stroke();
    },
    ellipse(args) {
        let defaults = { x: Number, y: Number, w: Number, h: Number, color: this._color || "black", fillColor: this._fillColor || "" };
        args = Mixin.getArgs(arguments, defaults);
        if (args.w < 0) args.w = -args.w;
        if (args.h < 0) args.h = -args.h;
        if (args.fillColor) {
            this._ctx.beginPath();
            this._ctx.ellipse(args.x + args.w / 2, args.y + args.h / 2, args.w / 2, args.h / 2, 0, 0, 2 * Math.PI);
            this._ctx.fillStyle = args.fillColor;
            this._ctx.fill();
        }
        if (args.color) {
            this._ctx.beginPath();
            this._ctx.ellipse(args.x + args.w / 2, args.y + args.h / 2, args.w / 2, args.h / 2, 0, 0, 2 * Math.PI);
            this._ctx.strokeStyle = args.color;
            this._ctx.stroke();
        }
    },
    circle(args) {
        let defaults = { x: Number, y: Number, r: Number, color: this._color || "black", fillColor: this._fillColor || "" };
        args = Mixin.getArgs(arguments, defaults);
        this.ellipse({ x: args.x, y: args.y, w: args.r / 2, h: args.r / 2, color: args.color, fillColor: args.fillColor })
    },
    text(args) {
        let defaults = { text: String, x: Number, y: Number, w: Number.MAX_VALUE, h: Number.MAX_VALUE, color: this._color || "black", fillColor: this._fillColor || "", borderColor: this._borderColor || "", font: this._font || "sans-serif", pitch: this._pitch || 12, textAlign: this._textAlign || "center", textBaseline: this._textBaseline || "middle" };
        args = Mixin.getArgs(arguments, defaults);
        if (args.w === Number.MAX_VALUE) args.w = Math.floor(args.text.length * args.pitch * 0.5);
        if (args.h === Number.MAX_VALUE) args.h = Math.floor(args.pitch * 1.5);
        if (args.fillColor) this.rect({ x: args.x, y: args.y, w: args.w, h: args.h, color: "", fillColor: args.fillColor });
        this._ctx.font = args.pitch + "px " + args.font;
        this._ctx.fillStyle = args.color;
        this._ctx.textAlign = args.textAlign;
        this._ctx.textBaseline = args.textBaseline;
        this._ctx.fillText(args.text, args.x + args.w / 2, args.y + args.h / 2);
        if (args.borderColor) this.rect({ x: args.x, y: args.y, w: args.w, h: args.h, color: args.borderColor, fillColor: "" });
    },
    point(args) {
        let defaults = { x: Number, y: Number, color: this._color };
        args = Mixin.getArgs(arguments, defaults);
        this.line({ color: args.color, x0: args.x, y0: args.y, x1: args.x + 1, y1: args.y + 1 });
    }
}
