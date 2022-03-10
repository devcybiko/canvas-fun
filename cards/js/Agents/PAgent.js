class PAgent {
    static factory(args = {}) {
        return (new this(args))._init(args);
    }
    constructor(args = {}) {
        this._ = {};
        this._.children = [];
        this._.context = {};
        this._.name = this.constructor.name;
    }
    _init(args = {}) {
        let p = this._;
        p.name = args.name || this.constructor.name;
        return this;
    }
    get name () { return this._.name;}
    get context () { return this._.context;}
    get children () { return this._.children;}

    add(pobj) {
        this._.children.push(pobj);
    }
    on(fnName, obj, x, y, event, context, eventType) {
        let stop = false;
        if (obj && obj[fnName]) stop = obj[fnName](x, y, event, context, eventType);
        return stop;
    }
    handle(eventType, event) {
        // console.log("handle", this.name, eventType);
        let stop = this.prolog(eventType, event);
        if (this[eventType]) {
            // console.log("...handle", eventType);
            for(let child of this._.children) {
                // console.log("......handle", child.name);
                if (stop) break;
                let [x, y] = child.deltas(event);
                stop = this[eventType](child, x, y, event, this._.context, eventType);
            }
        }
        stop = this.epilog(eventType, event);
        return stop;
    }
    prolog(eventType, event) {
        // this is called once at the beginning of event processing
        // can be overridden
    }
    epilog(eventType, event) {
        // this is called once at the end of event processing
        // can be overridden
    }
}