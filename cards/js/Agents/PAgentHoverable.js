class PAgentHoverable extends PAgent {
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        super(args);
    }
    _init(args) {
        super._init(args);
        this._.context.hoverObj = null;
        return this;
    }
    setHover(obj, x, y, event, context, eventType) {
        this.clearHover(x, y, event, context, eventType);
        context.hoverObj = obj;
        return this.on("onEnter", obj, x, y, event, context, eventType);
    }
    clearHover(x, y, event, context, eventType) {
        let stop = this.on("onExit", context.hoverObj, x, y, event, context, eventType);
        context.hoverObj = null;
        return stop;
    }
    // onMotion(obj, x, y, event, context, eventType) {
    //     // do nothing
    // }
    prolog(eventType, event) {
        // find the object currently under the mouse
        let stop = false;
        let currentObj = null;
        let hoverObj = this.context.hoverObj;
        let x = 0;
        let y = 0;

        for (let child of this.children) {
            [x, y] = child.deltas(event);
            if (child.inBounds(x, y)) {
                currentObj = child;
                break;
            }
        }
        if (!hoverObj) {
            if (currentObj) {
                this.setHover(currentObj, x, y, event, this.context, eventType);
            }
        } else {
            if (currentObj === hoverObj) {
                stop = this.on("onHover", hoverObj, x, y, event, this.context, eventType);
                // stop = false;
            } else if (currentObj) {
                this.setHover(currentObj, x, y, event, this.context, eventType);
            } else {
                this.clearHover(0, 0, event, this.context, eventType);
            }
        }
        return stop;
    }
}