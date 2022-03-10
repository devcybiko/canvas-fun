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
        return this;
    }
    onClick(x, y, event, context, eventType) {
        // console.log("CLICK!", this._.name, x, y);
        this._.isSelected = true;
        this._.flashCount = 5;
        event.isDirty = true;
        return true;
    }
    _flash() {
        this._.flashCount--;
        if (this._.flashCount > 2) return;
        if (this._.flashCount % 2 == 1) this._.isSelected = true;
        else this._.isSelected = false;
        this.draw();
        if (this._.flashCount === 0) clearInterval(this._.flashID);
    }
    onClickUp(x, y, event, context, eventType) {
        // console.log("CLICKUP!", this._.name, x, y);
        this._.flashID = setInterval(this._flash.bind(this), 50);
        return false;
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
        if (this._.isSelected) backgroundColor = "orange";
        if (this._.isHovering) backgroundColor = "green";
        if (this._.isSelected && this._.isHovering) backgroundColor = "brown";
        this.box(0, 0, this.w, this.h, color, backgroundColor)
        this.text(p.name, 0, 0, null, this.w, this.h);
        for (let child of this._.children) {
            child.draw();
        }
    }
}
