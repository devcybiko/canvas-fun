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
class PBitMapCanvas extends PBitMap {
}
class PBitMapImage extends PBitMap {
}

