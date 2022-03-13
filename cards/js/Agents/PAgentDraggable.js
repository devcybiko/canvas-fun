class PAgentDraggable extends PAgent{
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        super(args);
    }
    _init(args) {
        super._init(args);
        let p = this._;
        let context = p.context;
        context.dragObj = null;
        context.startX = 0;
        context.startY = 0;
        context.origX = 0;
        context.origY = 0;
        return this;
    }
    onClick(obj, x, y, event, context, eventType) {
        if (!event.shiftKey) return false;
        if (!obj.inBounds(x, y)) return false;
        context.dragObj = obj;
        context.startX = event.playfieldX;
        context.startY = event.playfieldY;
        context.origX = context.dragObj.x;
        context.origY = context.dragObj.y;
        event.isDirty = true;
        if (obj.onDragStart) return obj.onDragStart(x, y, event, context, eventType);
    }
    onClickUp(obj, x, y, event, context, eventType) {
        if (context.dragObj) {
            context.dragObj = null;
            if (obj.onDragStop) return obj.onDragStop(x, y, event, context, eventType);
        }
    }
    onMotion(obj, x, y, event, context, eventType) {
        if (!context.dragObj) return false;
        if (!event.shiftKey) {
            context.dragObj = null;
            if (obj.onDragStop) return obj.onDragStop(x, y, event, context, eventType);
        }
        let dx = event.playfieldX - context.startX;
        let dy = event.playfieldY - context.startY;
        event.isDirty = true;
        if (obj.onDrag) obj.onDrag(context.origX + dx, context.origY + dy, event, context, eventType)
        return true;
    }
}