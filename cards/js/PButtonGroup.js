class PButtonGroup extends PGroup {
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        super(args);
    }
    _init(args) {
        super._init(args);
        this._makeable(this._.parent, "PAgentClickable")
        return this;
    }
    onClick(x, y, event, context, eventType) {
        // console.log("PButtonGroup.onClick", this.name, x, y);
        for(let child of this.children) {
            child._.isSelected = false;
        }
    }
    onClickUp(x, y, event, context, eventType) {
        // console.log("PButtonGroup.onClickUp", this.name, x, y);
    }

}
