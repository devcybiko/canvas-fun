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

    add(pobj) {
        this._.children.push(pobj);
    }

    handle(eventType, event) {
        // console.log("handle", this.name, eventType);
        let stop = this.prolog(eventType, event);
        if (this[eventType]) {
            // console.log("...handle", eventType);
            for(let child of this._.children) {
                // console.log("......handle", child.name);
                if (stop) break;
                let x = event.playfieldX - child.X0;
                let y = event.playfieldY - child.Y0;
                stop = this[eventType](child, x, y, event, this._.context, eventType);
            }
        }
        if (!stop) stop = this.epilog(eventType, event);
        return stop;
    }
    prolog(eventType, event) {
        // this is called once at the beginning of event processing
        // this === the root object
        // you can use the "this" object to store contextual information that spans objects
        // can be overridden
    }
    epilog(eventType, event) {
        // this is called once at the end of event processing
        // can be overridden
    }
}