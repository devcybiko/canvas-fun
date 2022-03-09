class PButton extends PObject {
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        super(args);
    }
    _init(args) {
        super._init(args);
        this._init2(args);
        return this;
    }
    _init2(args) {
        this._addAgent(PAgentClickable.factory({obj: this}));
        this._addAgent(PAgentHoverable.factory({obj: this}));
    }
    onClick(x, y, event, context) {
        console.log("CLICK!", this._.name, x, y);
        context.clicked = this;
        event.isDirty = true;
        return true;
    }
    onEnter(x, y, event) {
        this._.backgroundColor = "green";
        event.isDirty = true;
        return true;
    }
    onExit(x, y, event) {
        this._.backgroundColor = "red";
        event.isDirty = true;
        return false;
    }
    draw() {
        // console.log(this._.name, this.x0, this.y0, this.x1, this.y1, this.w, this.h);
        let p = this._;
        let backgroundColor = p.backgroundColor;
        let color = p.color;
        let context = this._getAgentContext();
        if (context.clicked === this) backgroundColor = "orange";
        if (context.hoveringObj === this) backgroundColor = "green";
        if (context.hoveringObj === this && context.clicked === this) backgroundColor = "brown";
        this.box(0, 0, this.w, this.h, color, backgroundColor)
        this.text(p.name, 0, 0, null, this.w, this.h);
        for (let child of this._.children) {
            child.draw();
        }
    }
}
