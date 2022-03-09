if (typeof module !== 'undefined') {
    PRect = require("./PRect.js");
}

class PRelRect {
    static xywh(x0, y0, w, h, bx0=null, by0=null, bw=null, bh=null) {
        let relrect = new PRelRect(x0, y0, 0, 0, w, h);
        if (bx0 != null) relrect._.bx0 = bx0;
        if (by0 != null) relrect._.by0 = by0;
        if (bw != null) relrect._.bw = bw;
        if (bh != null) relrect._.bh = bh;
        return relrect;
    }
    static xyxy(x0, y0, x1, y1, bx0 = null, by0 = null, bx1=null, by1=null) {
        let relrect = new PRelRect(x0, y0, x1, y1, 0, 0);
        if (bx0 != null) relrect._.bx0 = bx0;
        if (by0 != null) relrect._.by0 = by0;
        if (bx1 != null) relrect._.bx1 = bx1;
        if (by1 != null) relrect._.by1 = by1;
        return relrect;
    }
    constructor(x0, y0, x1, y1, w = 0, h = 0) {
        let p = this._ = {
            mx0: 0, bx0: 0, mx1: 0, bx1: 0,
            my0: 0, by0: 0, my1: 0, by1: 0,
            mw: 0, bw: 0, mh: 0, bh: 0
        };
        if (Math.abs(x0) > 1.0) p.bx0 = x0; else p.mx0 = x0;
        if (Math.abs(x1) > 1.0) p.bx1 = x1; else p.mx1 = x1;
        if (Math.abs(y0) > 1.0) p.by0 = y0; else p.my0 = y0;
        if (Math.abs(y1) > 1.0) p.by1 = y1; else p.my1 = y1;
        if (Math.abs(w) > 1.0) p.bw = w; else p.mw = w;
        if (Math.abs(h) > 1.0) p.bh = h; else p.mh = h;
    }
    _scale(x0, w, m, b) {
        return Math.floor(x0 + m * w + b);
    }

    get x0() {return this._.bx0;}
    get y0() {return this._.bx1;}
    get x1() {return this._.by0;}
    get y1() {return this._.by1;}
    get w() {return this._.bw;}
    get h() {return this._.bh;}

    scale(parentRect) {
        let p = this._;
        // let px0 = this._scale(parentRect.x0, parentRect.w, p.mx0, p.bx0);
        // let py0 = this._scale(parentRect.y0, parentRect.h, p.my0, p.by0);
        // let px1 = this._scale(parentRect.x0, parentRect.w, p.mx1, p.bx1);
        // let py1 = this._scale(parentRect.y0, parentRect.h, p.my1, p.by1);
        let px0 = this._scale(0, parentRect.w, p.mx0, p.bx0);
        let py0 = this._scale(0, parentRect.h, p.my0, p.by0);
        let px1 = this._scale(0, parentRect.w, p.mx1, p.bx1);
        let py1 = this._scale(0, parentRect.h, p.my1, p.by1);
        let pw = this._scale(0, parentRect.w, p.mw, p.bw);
        let ph = this._scale(0, parentRect.h, p.mh, p.bh);
        let result = null;
        if (pw === 0 && ph === 0) result = PRect.xyxy(px0, py0, px1, py1);
        else result = PRect.xywh(px0, py0, pw, ph);
        return result;
    }
    move(x0, y0, x1, y1) {
        let p = this._;
        if (x0 !== undefined && x0 !== null) if (Math.abs(x0) > 1.0) {p.mx0 = 0; p.bx0 = x0;} else {p.mx0 = x0; p.bx0 = 0};
        if (x1 !== undefined && x1 !== null) if (Math.abs(x1) > 1.0) {p.mx1 = 0; p.bx1 = x1;} else {p.mx1 = x1; p.bx1 = 0};
        if (y0 !== undefined && y0 !== null) if (Math.abs(y0) > 1.0) {p.my0 = 0; p.by0 = y0;} else {p.my0 = y0; p.by0 = 0};
        if (y1 !== undefined && y1 !== null) if (Math.abs(y1) > 1.0) {p.my1 = 0; p.by1 = y1;} else {p.my1 = y1; p.by1 = 0};
        // p.mw = 0;
        // p.bw = 0;
        // p.mh = 0;
        // p.bh = 0;
    }
    resize(w, h) {
        let p = this._;
        if (w !== undefined && w !== null) if (Math.abs(w) > 1.0) {p.mw = 0; p.bw = w;} else {p.mw = w; p.bw = 0};;
        if (h !== undefined && h !== null) if (Math.abs(h) > 1.0) {p.mh = 0; p.bh = h;} else {p.mh = h; p.bh = 0};;
    }
}
if (typeof module !== 'undefined') {
    module.exports = PRelRect;
}
