if (typeof module !== 'undefined') {
    PRect = require("./PRect.js");
}

class PRelRect {
    constructor(x0, y0, x1, y1, w=0, h=0) {
        let p = this._ = {};
        p.float = [0, 0, 0, 0, 0, 0];
        p.delta = [0, 0, 0, 0, 0, 0];
        if (Math.abs(x0) > 1.0) p.delta[0] = x0; else p.float[0] = x0;
        if (Math.abs(x1) > 1.0) p.delta[2] = x1; else p.float[2] = x1;
        if (Math.abs(y0) > 1.0) p.delta[1] = y0; else p.float[1] = y0;
        if (Math.abs(y1) > 1.0) p.delta[3] = y1; else p.float[3] = y1;
        if (Math.abs(w) > 1.0) p.delta[4] = w; else p.float[4] = w;
        if (Math.abs(h) > 1.0) p.delta[5] = h; else p.float[5] = h;
    }
    _scale(x0, w, i) {
        return Math.floor(x0 + this._.float[i] * w + this._.delta[i]);
    }
    scale(pRect) {
        let p = this._;
        let px0 = this._scale(pRect.x0, pRect.w, 0);
        let py0 = this._scale(pRect.y0, pRect.h, 1);
        let px1 = this._scale(pRect.x0, pRect.w, 2);
        let py1 = this._scale(pRect.y0, pRect.h, 3);
        let pw = this._scale(0, pRect.w, 4);
        let ph = this._scale(0, pRect.h, 5);
        // if (p.delta[4] && p.float[0]) px0 -= p.delta[4]/2;
        // if (p.delta[5] && p.float[1]) py0 -= p.delta[5]/2;
        if (pw === 0 && ph === 0) return PRect.xyxy(px0, py0, px1, py1);
        else return PRect.xywh(px0, py0, pw, ph);
    }
}
if (typeof module !== 'undefined') {
    module.exports = PRelRect;
}
