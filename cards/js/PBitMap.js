class PBitMap {
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        this._ = {};
    }
    _init(args) {
        let p = this._;
        p.ctx = args.ctx;
        p.rect = PRect.xywh(args.x, args.y, args.w, args.h);
        return this;
    }
    get x() { return this._.rect.x0 };
    get y() { return this._.rect.y0 };
    get x0() { return this._.rect.x0 };
    get y0() { return this._.rect.y0 };
    get x1() { return this._.rect.x1 };
    get y1() { return this._.rect.y1 };
    get w() { return this._.rect.w };
    get h() { return this._.rect.h };

    point(bitmap, x, y, pointStyle) {
    }
    line(x0, y0, x1, y1, lineStyle = "black") {
        let p=this._;
        p.ctx.beginPath();
        p.ctx.strokeStyle = lineStyle;
        p.ctx.moveTo(x0, y0);
        p.ctx.lineTo(x1, y1);
        p.ctx.stroke();
    }
    box(x0, y0, w, h, borderColor = "black", fillColor) {
        let defaults = { x: Number, y: Number, w: Number, h: Number, color: this._color || "black", fillColor: this._fillColor || "" };
        // args = Mixin.getArgs(arguments, defaults);
        if (fillColor) {
            this._.ctx.fillStyle = fillColor;
            this._.ctx.fillRect(x0, y0, w, h);
        }
        if (borderColor) {
            this._.ctx.strokeStyle = borderColor;
            this._.ctx.strokeRect(x0, y0, w, h);
        }
    }
    blit(source, srect, dest, drect, options) {
    }
    ellipse(bitmap, rect, borderStyle) {
    }
    text_old(text, x0, y0, textStyle, w, h) {
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

    }
    text(text, x0, y0, textStyle, w, h) {
        let PITCH = 12;
        if (textStyle === undefined || textStyle === null) textStyle = {textBaseline: "middle", textAlign: "center", pitch: PITCH, color: "black", font: "sans-serif"};
        if (w === undefined) w = Math.floor(text.length * (textStyle.pitch||PITCH) * 0.5);
        if (h === undefined) h = Math.floor((textStyle.pitch||PITCH) * 1.5);
        this._.ctx.font = (textStyle.pitch||PITCH) + "px " + (textStyle.font || "sans-serif");
        this._.ctx.fillStyle = (textStyle.color || "black");
        this._.ctx.textAlign = (textStyle.textAlign || "center");
        this._.ctx.textBaseline = (textStyle.textBaseline || "middle");
        this._.ctx.fillText(text, x0 + w / 2, y0 + h / 2);
    }
    onClick(x, y, event) {
        console.log("onClick: ", this.name);
        return true;
    }
}
