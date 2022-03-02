class PLayout extends PObject {
    _init(args) {
        _log("PLayout")
        args = Mixin.getArgs(arguments, { name:"", xPercent:Number, yPercent:Number, wPercent:Number, hPercent:Number });
        super._init({ name:args.name, x:0, y:0, w:0, h:0});
        // let [xPercent, yPercent, wPercent, hPercent] = this._normalizePercents(args.xPercent, args.yPercent, args.wPercent, args.hPercent);
        let [xPercent, yPercent, wPercent, hPercent] = [args.xPercent, args.yPercent, args.wPercent, args.hPercent];
        this._xPercent = xPercent;
        this._yPercent = yPercent;
        this._wPercent = wPercent;
        this._hPercent = hPercent;
        this.move(xPercent, yPercent, false);
        this.resize(wPercent, hPercent, false);
        this._dirty = true;

        this._debug = false;
    }
    _normalizePercent(percent) {
        if (percent <=1.0) percent = percent;
        else percent = percent / 100.0;
        return percent;
    }
    _normalizePercents(xPercent, yPercent, wPercent, hPercent) {
        let results = [];
        for(let arg of arguments) {
            results.push(this._normalizePercent(arg));
        }
        return results;
    }
    _intOrPercent(x, percent) {
        if (percent > 1.0) return percent;
        return Math.floor(x * percent);
    }
    _recompute() {
        if (!this._dirty) return;
        this.debug("recompute");
        this._x = this._intOrPercent(this.getParent().w, this._xPercent);
        this._y = this._intOrPercent(this.getParent().h, this._yPercent);    
        this._w = this._intOrPercent(this.getParent().w, this._wPercent);
        this._h = this._intOrPercent(this.getParent().h, this._hPercent);
        for(let child of this.getChildren()) {
            this.debug("_recompute Child");
            child.move(child._xPercent, child._yPercent);
            child.resize(child._wPercent, child._hPercent);
            child.toFront();
        };
        this._dirty = false;
    }
    move(xPercent, yPercent, recompute = false) {
        this._xPercent = xPercent;
        this._yPercent = yPercent;
        this._dirty = true;
        if (recompute) this._recompute();
    }
    resize(wPercent, hPercent, recompute = true) {
        this._wPercent = wPercent;
        this._hPercent = hPercent;
        this._dirty = true;
        if (recompute) this._recompute();
    }
    onResize(x, y, w, h) {
        this._recompute();
    }
    add(obj, xPercent, yPercent, wPercent, hPercent) {
        // this.getPlayfield().add(obj);
        let newObj = PLayoutObj.factory({layout: this, obj, xPercent, yPercent, wPercent, hPercent});
        this.addChild(newObj);
        newObj.move(newObj._xPercent, newObj._yPercent);
        newObj.resize(newObj._wPercent, newObj._hPercent);
        this._dirty = true;
    }
    onDraw(ctx) {
        this.debug("onDraw...")
        this._recompute();
        this.rect({color:"red", x:this.X0, y:this.Y0, w:this.W, h:this.H});
        for(let child of this.getChildren()) {
            this.debug("onDraw child")
            child.obj._ctx = ctx;
            child.obj.onDraw(ctx);
        }
    }
    redraw() {
        this.getParent().redraw();
    }
    onClick(x, y, event) {
        _log("CLICK!!!!");
        event.clicked = null;
        this._isClicked = false;
        for(let child of this.getChildren()) {
            this.debug("onClick child")
            child.obj._onClickDown(event);
        }
    }
}

class PLayoutObj extends PObject {
    _init(args) {
        args = Mixin.getArgs(arguments, { layout: PLayout, obj: PObject, xPercent:Number, yPercent:Number, wPercent:Number, hPercent:Number });
        [this.layout, this.obj, this._xPercent, this._yPercent, this._wPercent, this._hPercent] = _delete(args, "layout", "obj", "xPercent", "yPercent", "wPercent", "hPercent", "_sealed_", "_args_");
        [this._xPercent, this._yPercent, this._wPercent, this._hPercent] = this.layout._normalizePercents(this._xPercent, this._yPercent, this._wPercent, this._hPercent);
        super._init(args);
        this.add(this.obj);
        this._debug = false;
    }
}
Mixin.mixin(PLayoutObj, { NodeMixin });
