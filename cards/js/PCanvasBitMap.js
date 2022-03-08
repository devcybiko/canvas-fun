class PCanvasBitMap extends PBitMap {
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        super(args);
    }
    _init(args) {
        let p = this._;
        p.canvas = document.querySelector(args.canvasId) || document.querySelector("#" + args.canvasId);
        if (!p.canvas) throw Error(`Could not find Canvas='${args.canvasId}' in DOM`);
        super._init({ctx: this._.canvas.getContext('2d'), x:0, y:0, w: p.canvas.width, h: p.canvas.height});
        return this;
    }
}
