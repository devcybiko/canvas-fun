class PGroup extends PObject {
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        super(args);
    }
    _init(args) {
        super._init(args);
        this._addAgent(PAgentClickable.factory());
        this._addAgent(PAgentHoverable.factory());
        this._makeable(this._.parent, "PAgentHoverable")
        this._makeable(this._.parent, "PAgentClickable")
        return this;
    }
    onHover(x, y, event, context, eventType) {
        let agentContext = this._getContext("PAgentHoverable");
        let hoverObj = agentContext.hoverObj
        if (hoverObj) {
            let [x, y] = hoverObj.deltas(event);
            if (!hoverObj.inBounds(x, y)) {
                agentContext.hoverObj.onExit(x, y, event, context, eventType)
            }
        }
    }
    // onClick(x, y, event, context, eventType) {
    //     console.log("PGroup.onClick", this.name, x, y);
    //     for(let child of this.children) {
    //         child._.isSelected = false;
    //     }
    //     event.isDirty = true;
    // }
    onClickUp(x, y, event, context, eventType) {
        let agentContext = this._getContext("PAgentClickable");
        console.log({agentContext});
        if (agentContext.armedObj) {
            [x, y] = agentContext.armedObj.deltas(event);
            if (!agentContext.armedObj.inBounds(x,y)) {
                console.log("PGroup.onClickUp", this.name, x, y);
                agentContext.armedObj.disarm(agentContext, event);
            }
        }
    }
}
