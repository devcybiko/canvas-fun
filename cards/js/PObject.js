class PObject {
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        this._ = {};
        this._.name = "none";
        this._.parent = null;
        this._.children = [];
        this._.relrect = null;
        this._.rect = null;
    }
    _init(args) {
        console.log("PObject", args);
        this._.name = args.name || "none";
        if (args.parent) {
            args.parent.add(this, args.relrect);
        }
        return this;
    }
    _recompute() {
        console.log("_recompute", this._.name);
        if (this._.relrect) this._.rect = this._.relrect.scale(this._.parent.rect);
        console.log("_recompute", this._.rect._.x0, this._.rect._.y0, this._.rect._.w, this._.rect._.h);
        for (let child of this._.children) {
            child._recompute();
        }
    }

    get rect() { return this._.rect }
    add(child, relrect) {
        console.log("add", this._.name, child._.name);
        let parent = this._;
        parent.children.push(child);
        child._.parent = this;
        if (relrect) {
            child._.relrect = relrect;
            child._.rect = relrect.scale(parent.rect);
            child._recompute;
        }
    }
    box(x0, y0, w, h, borderColor, fillColor) {
        let parent = this._.parent;
        if (parent) {
            parent.box(x0, y0, w, h, borderColor, fillColor);
        }
    }
    text(text, x0, y0, textStyle, w, h) {
        let parent = this._.parent;
        if (parent) {
            parent.text(text, x0, y0, textStyle, w, h);
        }
    }
    move(x0, y0, x1, y1) {
        console.log("move", this._.name, x0, y0);
        this._.relrect.move(x0, y0, x1, y1);
    }
    resize(w, h) {
        this._.relrect.resize(w, h);
    }
    draw() {
        let p = this._;
        let rect = p.rect;
        this.box(rect.x, rect.y, rect.w, rect.h, "1px solid black", "red")
        this.text(p.name, rect.x, rect.y, null, rect.w, rect.h);
        for (let child of this._.children) {
            child.draw();
        }
    }
}