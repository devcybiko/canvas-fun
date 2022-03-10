class PButtonArmed extends PButton {
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        super(args);
    }
    _init(args) {
        super._init(args);
        return this;
    }
    arm(context, event) {
        console.log("ARM!", context);
        if (context.armedObj) this.disarm(context)
        this._.isSelected = true;
        this._.isArmed = true;
        event.isDirty = true;
        context.armedObj = this;
    }
    disarm(context, event) {
        console.log("DISARM!", context);
        this._.isSelected = false;
        this._.isArmed = false;
        context.armedObj = null;
        event.isDirty = true;
    }
    fire(context, event) {
        console.log("FIRE!", context);
        this._.flashCount = 5;
        this._.flashID = setInterval(this._flash.bind(this), 50);
        this.disarm(context, event);
        event.isDirty = true;
    }
    onClick(x, y, event, context, eventType) {
        this.arm(context, event);
    }
    onClickUp(x, y, event, context, eventType) {
        if (context.armedObj === this) {
            console.log("firing...");
            this.fire(context, event);
        } else {
            console.log("disarming...", context.armedObj);
            this.disarm(context, event);
        }
    }
    onEnter(x, y, event, context, eventType) {
        console.log("onEnter...")
        super.onEnter(x, y, event, context, eventType);
        let clickContext = this.parent._getContext("PAgentClickable");
        console.log("onEnter", clickContext);
        if (this == clickContext.armedObj) this._.isSelected = true;
        event.isDirty = true;
        return false;
    }
    onExit(x, y, event, context, eventType) {
        super.onExit(x, y, event, context, eventType);
        this._.isSelected = false;
        event.isDirty = true;
        return false;
    }
}
