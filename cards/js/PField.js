class PRect {
    static xywh(x, y, w, h) {
        if (w < 0) { x += w; w = -w; }
        if (h < 0) { y += h; h = -h; }
        return new PRect(x, y, x + w, y + h, w, h);
    }
    static xyxy(x0, y0, x1, y1) {
        if (x0 > x1) [x1, x0] = [x0, x1];
        if (y0 > y1) [y1, y0] = [y0, y1];
        return new PRect(x0, y0, x1, y1, x1 - x0, y1 - y0);
    }
    constructor(x0, y0, x1, y1, w, h) {
        let p = this._ = {};
        p.x0;
        p.y0;
        p.x1;
        p.y1;
        p.w;
        p.h;
    }
    get x() { return this._.x0 };
    get y() { return this._.y0 };
    get x0() { return this._.x0 };
    get y0() { return this._.y0 };
    get x1() { return this._.x1 };
    get y1() { return this._.y1 };
    get w() { return this._.w };
    get h() { return this._.h };
}

class PField {
    constructor(args) {
        this._rect = new PRect(); // actual coordinates relative to parent
        this._relrect = new PRect(); // percentages relative to parent's PRect
        this._bitmap = new PBitMap(); // for rendering upon, possibly a canvas
        this._data = {};
        this._node = null; // pointer to tree i belong to
    }
    relMove(relrect) { }
    move(rect) { }
}

class PNode {
    constructor(args) {
        this._parent = null;
        this._children = [];
        this._obj;
        this._data = {};
    }
}

class PObj {
    constructor(args) {

    }
}

class PTablet {
    // 2-d control surface
    constructor(args) {

    }
}
class PBitMap {
    constructor(args) {
        this._rect = new PRect();
    }
    point(bitmap, x, y, pointStyle) {
    }
    line(bitmap, x0, y0, x1, y1, lineStyle) {
    }
    rect(bitmap, rect, borderStyle, fillStyle) {
    }
    blit(source, srect, dest, drect, options) {
    }
    ellipse(bitmap, rect, borderStyle) {
    }
    text(bitmap, text, rect, textStyle) {
    }
}
class PBitMapCanvas extends PBitMap {
}
class PBitMapImage extends PBitMap {
}

