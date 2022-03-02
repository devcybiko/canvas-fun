NodeMixin = {
    NodeMixin() {
        this._parent = null;
        this._children = [];
        this._data = {};
    },
    getParent() { return this._parent; },
    addChild(child, n) {
        if (child) {
            if (n !== undefined) this._children.splice(n, 0, child);
            else this._children.push(child);
            child._parent = this;
        }
    },
    getChildren() {
        return this._children.slice(0); // clone of array
    },
    removeChild(obj) {
        let oldChild = null;
        if (typeof obj === "number") {
            if (this._children.length > n) oldChild = this._children.splice(obj, 1);
        } else {
            let i = this._children.indexOf(obj);
            if (i >= 0) oldChild = this._children.splice(i, 1);
        }
        return oldChild;
    },
    emptyChildren() {
        let children = this._children;
        this._children = [];
        return children;
    },
    getData () {
        return this._data;
    }
}