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
        args = Mixin.getArgs(arguments, { playfield: undefined, msg: undefined, timeout: 3000, callback: null, context: null });
        super._init(args.playfield, "msg", "black", 
            args.playfield.w / 4, args.playfield.h / 2 - 12, args.playfield.w / 2, 24);
        if (args.msg) {
            this.show(args.msg, args.timeout, args.callback, args.context);
        }
    }
    show(msg, timeout = 1000, callback, context) {
        this._msg = msg;
        this.setTimer(timeout, callback, context);
        super.show();
    }
    hide() {
        this._msg = null;
        this.setTimer(0);
        super.hide();
    }
    click(x, y) {
        console.log("CLICK MSG!");
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

class Label extends PObject {
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
        args = Mixin.getArgs(arguments, { playfield: undefined, x: 0, y: 0, w: 0, h: 0});
        super._init(args.playfield, "msg", "black", args.x, args.y, args.w, args.h);
        this._text = "";
    }
    setText(text) {
        this._text = text;
        this.toFront();
    }
    draw(ctx) {
        if (this._text) {
            this.borderText(ctx, this._text, "black", "white", "black", this.x, this.y, this.w, this.h);
        }
    }
}

class Button extends PObject {
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
        args = Mixin.getArgs(arguments, { playfield: undefined, text: "", x:0, y: 0, w: 0, h: 0, callback:undefined, context:undefined});
        super._init(args.playfield, "msg", "black", args.x, args.y, args.w, args.h);
        this._text = args.text;
        this._callback = args.callback;
        this._context = args.context;
    }
    setText(text) {
        this._text = text;
        this.toFront();
    }
    draw(ctx) {
        if (this._text) {
            this.borderText(ctx, this._text, "black", "white", "black", this.x, this.y, this.w, this.h);
        }
    }
    click(x,y) {
        this._callback(this._context);
    }

}
