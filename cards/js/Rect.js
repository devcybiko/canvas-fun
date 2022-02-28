class Rect extends Mixin {
    _init() {
        this._x = 0;
        this._y = 0;
        this._w = 0;
        this._h = 0;
    }
    get x() { return this._x; }
    get y() { return this._y; }
    get w() { return this._w; }
    get h() { return this._h; }
    get x0() { return this._x; }
    get y0() { return this._y; }
    get x1() { return this.x0 + this.w; }
    get y1() { return this.y0 + this.h; }

    get X() { return this._x; }
    get Y() { return this._y; }
    get X0() { return this._x; }
    get Y0() { return this._y; }
    get X1() { return this.x + this.w; }
    get Y1() { return this.y + this.h; }
    get W() { return this._w; }
    get H() { return this._h; }
    getRect() {return {x:this.x, y:this.y, w:this.w, h:this.h}}
}

