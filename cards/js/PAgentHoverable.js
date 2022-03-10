class PAgentHoverable extends PAgent {
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        super(args);
    }
    _init(args) {
        return super._init(args);
    }
    prolog(eventType, event) {
        console.log("hover", "prolog", eventType);
        let x = event.playfieldX - this.obj.X0;
        let y = event.playfieldY - this.obj.Y0;
        let context = this.obj._getAgentContext(this.contextName);
        console.log("prolog", this.contextName, context);
        if (context.hoveringObj && !context.hoveringObj.inBounds(x, y)) {

            if (context.hoveringObj.onExit) context.hoveringObj.onExit(x, y, event, context)
            context.hoveringObj = null;
        }
    }
    onMotion(x, y, event, context) {
        console.log("hover", "onMotion", eventType);
        let obj = this.obj;
        console.log("onMotion", obj.name);
        if (!context.hoveringObj && obj.inBounds(x, y)) {
            context.hoveringObj = obj;
            if (obj.onEnter) return obj.onEnter(x, y, event, context);
        }
    }
}