class PButtonSelect extends PButton {
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        super(args);
        this._.isSelected = false;
    }
    _init(args) {
        super._init(args);
        return this;
    }
    onClick(x, y, event, context, eventType) {
        // console.log("CLICK!", this._.name, x, y);
        this._.isSelected = true;
        event.isDirty = true;
        return true;
    }
    onClickUp(x, y, event, context, eventType) {
        // do nothing
        // specifically, don't reset the isSelected flag
    }
}
