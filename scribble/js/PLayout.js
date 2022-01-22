class PLayout extends PObject {
    static {
      this.mixin({ Node, GraphicsMixin, LoggingMixin });
    }
    _init(args) {
        args = Mixin.getArgs(arguments, { parent: Node, name:"", xPercent:Number, yPercent:Number, wPercent:Number, hPercent:Number });
        super._init({parent:args.parent, name:args.name, x:0, y:0, w:0, h:0});
        this._objs = [];
        let [xPercent, yPercent, wPercent, hPercent] = this._normalizePercents(args.xPercent, args.yPercent, args.wPercent, args.hPercent);
        this._xPercent = xPercent;
        this._yPercent = yPercent;
        this._wPercent = wPercent;
        this._hPercent = hPercent;
        this.move(xPercent, yPercent);
        this.resize(wPercent, hPercent);
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
    _recompute() {
        this._x = Math.floor(this.getParent().w * this._xPercent);
        this._y = Math.floor(this.getParent().h * this._yPercent);    
        this._w = Math.floor(this.getParent().w * this._wPercent);
        this._h = Math.floor(this.getParent().h * this._hPercent);
        for(let obj of this._objs) {
            obj.move(obj._xPercent, obj._yPercent);
            obj.resize(obj._wPercent, obj._hPercent);
        };
        this.redraw();
    }
    move(xPercent, yPercent, recompute = false) {
        this._xPercent = xPercent;
        this._yPercent = yPercent;
        if (recompute) this._recompute();
    }
    resize(wPercent, hPercent, recompute = true) {
        this._wPercent = wPercent;
        this._hPercent = hPercent;
        if (recompute) this._recompute();
    }
    onResize(x, y, w, h) {
        this._recompute();
    }
    add(obj, xPercent, yPercent, wPercent, hPercent) {
        let newObj = new PLayoutObj(this, obj, xPercent, yPercent, wPercent, hPercent);
        this._objs.push(newObj);
        newObj.move(newObj._xPercent, newObj._yPercent);
        newObj.resize(newObj._wPercent, newObj._hPercent);
    }
    onDraw(ctx) {
        this.rect({color:"black", x:this.X0, y:this.Y0, w:this.W, h:this.H});
        // for(obj of objs) {
        //     obj.onDraw(ctx);
        // }
    }
    redraw() {
        console.log("PLayout.redraw");
        console.log("xxx", this);
        console.log("redraw", this.getParent());
        this.getParent().redraw();
    }
}

class PLayoutObj {
    constructor(layout, obj, xPercent, yPercent, wPercent, hPercent) {
        this.obj = obj;
        this.layout = layout;
        [this._xPercent, this._yPercent, this._wPercent, this._hPercent] = layout._normalizePercents(xPercent, yPercent, wPercent, hPercent);
    }
    move(xPercent, yPercent) {
        this._xPercent = xPercent;
        this._yPercent = yPercent;
        let x = Math.floor(this.layout.x + this.layout.w * xPercent);
        let y = Math.floor(this.layout.y + this.layout.h * yPercent);
        this.obj.move(x, y);
    }
    resize(wPercent, hPercent) {
        this._wPercent = wPercent;
        this._hPercent = hPercent;
        let w = Math.floor(this.layout.w * wPercent);
        let h = Math.floor(this.layout.h * hPercent);
        this.obj.resize(w,h);
    }
}