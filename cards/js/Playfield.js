/**
 * a Playfield is a PObject that renders on a bitmap
 * it has children 
 * there is a rect() that points to the bitmap (not relrect)
 * as such only integer (not percent) offsets are allowed
 */
class Playfield extends PObject {
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        super(args);
    }
    _init(args) {
        super._init(args);
        let p = this._;
        p.bitmap = args.bitmap;
        p.bitmap = args.bitmap;
        p.rect = PRect.xywh(p.bitmap.x, p.bitmap.y, p.bitmap.w, p.bitmap.h);
        p.agentContexts = {};
        return this;
    }
    _prologs(eventType, event) {
        for(let contextName of Object.keys(this._.agentContexts)) {
            let context = this._getAgentContext(contextName);
            for (let className of Object.keys(context.classes)) {
                let clazz = context.classes[className];
                clazz.prolog(eventType, event, context)
            }
        }
    }
    _epilogs(eventType, event) {
        for(let contextName of Object.keys(this._.agentContexts)) {
            let context = this._getAgentContext(contextName);
            for (let className of Object.keys(context.classes)) {
                let clazz = context.classes[className];
                clazz.epilog(eventType, event, context)
            }
        }
    }
    _dispatchEventAcrossAgents(obj, eventType, event, method) {
        let stop = false;
        for(let agent of obj._.agents) {
            if (stop) break;
            stop = agent.handle(eventType, event, method);
        }
        return stop;
    }
    _dispatchEventAcrossChildren(obj, eventType, event,) {
        // console.log("_dispatchEventAcrossChildren", obj.name, eventType);
        let stop = this._dispatchEventAcrossAgents(obj, eventType, event);
        let children = obj.children.slice(0).reverse();
        for(let child of children) {
            if (stop) break;
            stop = this._dispatchEventAcrossChildren(child, eventType, event);
        }
        return stop;
    }
    dispatchEventAcrossChildren(eventType, event) {
        this._prologs(eventType, event);
        let stop = this._dispatchEventAcrossChildren(this, eventType, event);
        this._epilogs(eventType, event);
        if (event.isDirty) this.draw();
        return stop
    }

    move(x0, y0, x1, y1) {
        this._.rect = this._.rect.move(x0, y0, x1, y1);
        this._recompute();
    }
    resize(w, h) {
        this._.rect = this._.rect.resize(w, h);
        this._recompute();
    }
    box(x0, y0, w, h, borderColor, fillColor) {
        this._.bitmap.box(x0, y0, w, h, borderColor, fillColor);
    }
    text(text, x0, y0, textStyle, w, h) {
        this._.bitmap.text(text, x0, y0, textStyle, w, h);
    }
    draw() {
        let p = this._;
        this._recompute();
        let rect = this.rect;
        this.box(rect.x, rect.y, rect.w, rect.h, "black", "white")
        for(let child of this._.children) {
            child.draw();
        }
    }
}