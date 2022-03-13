class PButtonFlash extends PButton {
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
    _flash() {
        _log("_flash", this._.flashCount);
        this._.flashCount--;
        if (this._.flashCount > 2) return;
        if (this._.flashCount % 2 == 1) this._.isSelected = true;
        else this._.isSelected = false;
        if (this._.flashCount <= 0) clearInterval(this._.flashID);
        this.draw();
    }
    onClick(x, y, event, context, eventType) {
        // console.log("CLICK!", this._.name, x, y);
        this._.isSelected = true;
        event.isDirty = true;
        this._.flashCount = 5;
        this._.flashID = setInterval(this._flash.bind(this), 50);
        return true;
    }
    onClickUp(x, y, event, context, eventType) {
        // do nothing
        // specifically, don't reset the isSelected flag
    }
}
