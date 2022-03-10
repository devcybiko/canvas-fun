class PButtonSelect extends PButton {
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        super(args);
        this._.isSelected = false;
        this._.isHovering = false;
    }
    _init(args) {
        super._init(args);
        this._makeable(this._.parent, "PAgentClickable")
        return this;
    }
    onClick(x, y, event, context, eventType) {
        // console.log("CLICK!", this._.name, x, y);
        this._.isSelected = true;
        event.isDirty = true;
        return true;
    }
    onClickUp(x, y, event, context, eventType) {
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
}
