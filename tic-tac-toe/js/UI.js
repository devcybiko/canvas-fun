class Message extends PObject {
    static {
        this.mixin({ GraphicsMixin });
        this.mixin({ LoggingMixin });
    }
    static factory(args) {
        let obj = new this(null);
        obj._init(...arguments);
        Mixin.seal(obj);
        return obj;
    }
    _init(args) {
        args = Mixin.getArgs(arguments, { playfield: undefined, msg: null, timeout: 3000 });
        super._init(args.playfield, "msg", "black", 
            args.playfield._w / 4, args.playfield._h / 2 - 12, args.playfield._w / 2, 24);
        if (args.msg) {
            this.show(args.msg, args.timeout);
        }
    }
    show(msg, timeout = 1000, callback = null, context = null) {
        this._msg = msg;
        this.setTimer(timeout, callback, context);
        super.show();
        this.toFront();
    }
    hide() {
        this._msg = null;
        this.setTimer(0);
        super.hide();
    }
    click(x, y) {
        console.log("CLICK!");
        this.hide();
    }
    draw(ctx) {
        if (this._msg) {
            this.borderText(ctx, this._msg, "black", "white", "black", this.x, this.y, this.w, this.h);
        }
    }
    go() {
        if (!this.getTimer() || !this._msg) this.hide();
        else this.toFront();
    }
}
