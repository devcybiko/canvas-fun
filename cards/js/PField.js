class PRect {
    constructor(args) {
        this._x0;
        this._y0;
        this._x1;
        this._y1;
        this._w;
        this._h;    
    }
    static xywh(x,y,w,h) {
        return new PRect();
    }
    static xyxy(x0,y0,x1,y1) {
        return new PRect();
    }
    get x();
    get y();
    get x0();
    get y0();
    get x1();
    get y1();
    get w();
    get h();
}

class PField {
    constructor(args) {
        this._rect = new PRect(); // actual coordinates relative to parent
        this._relrect = new PRect(); // percentages relative to parent's PRect
        this._bitmap = new PBitMap(); // for rendering upon, possibly a canvas
        this._data = {};
        this._node = null; // pointer to tree i belong to
    }
    relMove(relrect){}
    move(rect) {}
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

