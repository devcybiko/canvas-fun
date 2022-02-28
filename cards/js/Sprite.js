class Sprite extends PObject {
    static {
        Mixin.mixin({ GraphicsMixin });
    }
    _init(args) {
        args = Mixin.getArgs(arguments, { bitmap: ImageBitmap, name: "", x: 0, y: 0, selected: false });
        [this._bitmap] = _delete(args, "bitmap", "_args_", "_sealed_");
        super._init(args);
        this._w = this._bitmap.width;
        this._h = this._bitmap.height;
    }
    resize(w, h) {
        if (w === undefined && h === undefined) {
            this._w = this._bitmap.width;
            this._h = this._bitmap.height;
        } else if (w === undefined) {
            let ch = this._bitmap.height;
            let cw = this._bitmap.width;
            let aspect = ch / cw;
            this._h = Math.floor(h);
            this._w = Math.floor(this._h / aspect);
        } else if (h === undefined) {
            let ch = this._bitmap.height;
            let cw = this._bitmap.width;
            let aspect = ch / cw;
            this._w = Math.floor(w);
            this._h = Math.floor(this._w * aspect);
        } else {
            this._w = Math.floor(w);
            this._h = Math.floor(h);
        }
    }
    onDraw() {
        this.bitmap(this._bitmap, this.x, this.y, this.w, this.h);
    }
}