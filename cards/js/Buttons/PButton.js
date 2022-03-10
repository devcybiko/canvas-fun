class PButton extends PObject {
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
        this._makeable(this._.parent, "PAgentHoverable")
        return this;
    }
    _flash() {
        this._.flashCount--;
        if (this._.flashCount > 2) return;
        if (this._.flashCount % 2 == 1) this._.isSelected = true;
        else this._.isSelected = false;
        this.draw();
        if (this._.flashCount === 0) clearInterval(this._.flashID);
    }
    onClick(x, y, event, context, eventType) {
        // console.log("CLICK!", this._.name, x, y);
        this._.isSelected = true;
        this._.flashCount = 5;
        this._.flashID = setInterval(this._flash.bind(this), 50);
        event.isDirty = true;
        return true;
    }
    onClickUp(x, y, event, context, eventType) {
        // console.log("CLICKUP!", this._.name, x, y);
        return false;
    }
    onEnter(x, y, event, context, eventType) {
        this._.isHovering = true;
        event.isDirty = true;
        return false;
    }
    onExit(x, y, event, context, eventType) {
        this._.isHovering = false;
        event.isDirty = true;
        return false;
    }
    draw() {
        // console.log(this._.name, this.x0, this.y0, this.x1, this.y1, this.w, this.h);
        let p = this._;
        let backgroundColor = p.backgroundColor;
        let color = p.color;
        if (this._.isHovering) backgroundColor = "#c00";
        if (this._.isArmed) backgroundColor = "gray";
        if (this._.isSelected) backgroundColor = "orange";
        if (this._.isHovering && this._.isSelected) backgroundColor = "#c80";
        this.box(0, 0, this.w, this.h, color, backgroundColor)
        this.text(p.name, 0, 0, null, this.w, this.h);
        for (let child of this._.children) {
            child.draw();
        }
    }
}
