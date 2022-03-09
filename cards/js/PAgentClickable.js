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
    onClick(x, y, event, context) {
        let obj = this.obj;
        if (obj.inBounds(x, y) && obj.onClick) {
            console.log("onClick", obj.name, context);
            return obj.onClick(x, y, event, context);
        }
    }
}