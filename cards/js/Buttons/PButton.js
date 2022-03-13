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
        this._makeable(this._.parent, "PAgentDraggable");
        this._makeable(this._.parent, "PAgentClickable");
        this._makeable(this._.parent, "PAgentHoverable");
        return this;
    }
    onClick(x, y, event, context, eventType) {
        // console.log("CLICK!", this._.name, x, y);
        return false;
    }
    onClickUp(x, y, event, context, eventType) {
        // console.log("CLICKUP!", this._.name, x, y);
        return false;
    }
    onDragStart(x, y, event, context, eventType) {
        this.toFront();
        event.isDirty = true;
        return true;
    }
    onDrag(x, y, event, context, eventType){
        context.dragObj.move(x, y);
        event.isDirty = true;
        return true;
    }
    onDragStop(x, y, event, context, eventType) {
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
    }
}
