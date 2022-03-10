class PGroupButton extends PGroup {
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        super(args);
    }
    _init(args) {
        super._init(args);
        this._makeable(this._.parent, "PAgentClickable")
        this._makeable(this._.parent, "PAgentHoverable")
        return this;
    }
    onClick(x, y, event, context, eventType) {
        console.log("PGroupButton.onClick", this.name, x, y);
        for(let child of this.children) {
            child._.isSelected = false;
        }
        event.isDirty = true;
    }
}
