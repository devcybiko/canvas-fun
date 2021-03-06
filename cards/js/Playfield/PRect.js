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
        p.x0 = x0;
        p.y0 = y0;
        p.x1 = x1;
        p.y1 = y1;
        p.w = w;
        p.h = h;
    }
    get x() { return this._.x0 };
    get y() { return this._.y0 };
    get x0() { return this._.x0 };
    get y0() { return this._.y0 };
    get x1() { return this._.x1 };
    get y1() { return this._.y1 };
    get w() { return this._.w };
    get h() { return this._.h };

    move(x0, y0, x1, y1) {
        if (x0 === undefined || x0 === null) x0 = this._.x0;
        if (y0 === undefined || y0 === null) y0 = this._.y0;
        if (x1 === undefined || x1 === null) x1 = this._.x1;
        if (y1 === undefined || y1 === null) y1 = this._.y1;
        return PRect.xyxy(x0, y0, x1, y1);
    }
    resize(w, h) {
        if (w === undefined || w === null) w = this._.w;
        if (h === undefined || h === null) h = this._.h;
        return PRect.xywh(this._.x0, this._.y0, w, h);
    }
}

if (typeof module !== 'undefined') {
    module.exports = PRect;
}