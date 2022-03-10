/**
 * a Playfield is a PObject that renders on a bitmap
 * it has children 
 * there is a rect() that points to the bitmap (not relrect)
 * as such only integer (not percent) offsets are allowed
 */
class Playfield extends PObject {
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        super(args);
    }
    _init(args) {
        super._init(args);
        let p = this._;
        p.canvasId = args.canvasId;
        p.canvas = document.querySelector(args.canvasId) || document.querySelector("#" + args.canvasId);
        p.bitmap = PBitmapCanvas.factory({canvasId: args.canvasId});
        p.rect = PRect.xywh(p.bitmap.x, p.bitmap.y, p.bitmap.w, p.bitmap.h);
        this._addAgent(PAgentClickable.factory());
        this._addAgent(PAgentHoverable.factory());
        return this;
    }
    move(x0, y0, x1, y1) {
        this._.rect = this._.rect.move(x0, y0, x1, y1);
        this._recompute();
    }
    resize(w, h) {
        console.log("resize", w, h)
        // this._.rect = this._.rect.resize(w, h);
        let p = this._;
        p.canvas = document.querySelector(p.canvasId) || document.querySelector("#" + p.canvasId);
        p.bitmap = PBitmapCanvas.factory({canvasId: p.canvasId});
        p.rect = PRect.xywh(p.bitmap.x, p.bitmap.y, p.bitmap.w, p.bitmap.h);
        this._recompute();
    }
    box(x0, y0, w, h, borderColor, fillColor) {
        this._.bitmap.box(x0, y0, w, h, borderColor, fillColor);
    }
    text(text, x0, y0, textStyle, w, h) {
        this._.bitmap.text(text, x0, y0, textStyle, w, h);
    }
    draw() {
        let p = this._;
        this._recompute();
        let rect = this.rect;
        this.box(rect.x, rect.y, rect.w, rect.h, "black", "white")
        for(let child of this._.children) {
            child.draw();
        }
    }
}