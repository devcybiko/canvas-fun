class PAgentClickable extends PAgent{
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        super(args);
    }
    _init(args) {
        return super._init(args);
    }
    onClick(obj, x, y, event, context, eventType) {
        if (obj.inBounds(x, y) && obj.onClick) {
            return obj.onClick(x, y, event, context, eventType);
        }
    }
    onClickUp(obj, x, y, event, context, eventType) {
        if (obj.inBounds(x, y) && obj.onClick) {
            return obj.onClickUp(x, y, event, context, eventType);
        }
    }
}