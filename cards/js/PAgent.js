class PAgent {
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        this._ = {};
    }
    _init(args) {
        this.obj = args.obj;
        this.contextName =  args.contextName || "default";
        console.log("_init", args);
        let pRoot = this.obj.root._;
        /**
         * on the root object, we're creating a list of agent contexts
         * root.agenetContexts.default={} - this is the default context. 
         * - default[key] is the source for all context variables
         * - default.classes=[] - a list of objects which have this.prolog/epilog methods
         * before we traverse the list of all agents, the prolog method is called on each 'class' to update the context
         * then we traverse the list of all agents
         * after we traverse the list of agents, the epilog method is called on each 'class' to clean up the context
         * See: Playfield.dispatchEventAcrossChildren()
         */
        pRoot.agentContexts = pRoot.agentContexts || {};
        pRoot.agentContexts[this.contextName] = pRoot.agentContexts[this.contextName] || {};
        let context = pRoot.agentContexts[this.contextName];
        context.contextName = this.contextName;
        context.classes = context.classes || {};
        context.classes[this.constructor.name] = this;
        return this;
    }
    handle(eventType, event) {
        let x = event.playfieldX - this.obj.X0;
        let y = event.playfieldY - this.obj.Y0;
        let context = this.obj._getAgentContext(this.contextName);
        console.log("handle", eventType, this.contextName, this.obj._.groupName, context);
        let stop = false;
        if (this[eventType]) stop = this[eventType](x, y, event, context);
        return stop;
    }
    prolog(eventType, event, context) {
        // this is called once at the beginning of event processing
        // this === the root object
        // you can use the "this" object to store contextual information that spans objects
        // can be overridden
    }
    epilog(eventType, event, context) {
        // this is called once at the end of event processing
        // can be overridden
    }
}