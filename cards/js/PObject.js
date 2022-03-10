class PObject {
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        this._ = {};
        this._.root = this;
        this._.name = "none";
        this._.parent = null;
        this._.children = [];
        this._.relrect = null;
        this._.rect = null;
        this._.agents = [];
        this._.backgroundColor = "red";
        this._.hoverColor = "green";
        this._.saveColor = "red";
        this._.color = "black";
        this._.perpetuateEvents = true;
    }
    _init(args) {
        this._.name = args.name || "none";
        this._agents = args.agents;
        if (args.parent) {
            args.parent.add(this, args.relrect);
        }
        return this;
    }
    _recompute() {
        if (this._.relrect) this._.rect = this._.relrect.scale(this._.parent.rect);
        for (let child of this._.children) {
            child._recompute();
        }
    }
    _inBounds(X, Y, dx = 0, dy = 0) {
        // console.log("inbounds", this.name, this.X1, this.Y1,  this.X0 - dx / 2, x, this.X1 + dx / 2, this.y0 - dy / 2, y, this.y1 + dy / 2);
        let result = _between(this.X0 - dx / 2, X, this.X1 + dx / 2) && _between(this.Y0 - dy / 2, Y, this.Y1 + dy / 2);
        return result;
    }
    _dispatchAgents(eventType, event) {
        let p = this._;
        let stop = false;
        for(let agent of p.agents) {
            if (stop) break;
            stop = agent.handle(eventType, event);
        }
        if (p.perpetuateEvents && !stop) {
            for(let child of this.children) {
                if (stop) break;
                stop = child._dispatchAgents(eventType, event);
            }
        }
        if (event.isDirty) this.draw();
        return stop
    }

    get name() { return this._.name; }
    get parent() { return this._.parent }
    get root() { return this._.root }
    get rect() { return this._.rect }
    get children() { return this._.children }
    get x() { return this.x0; }
    get y() { return this.y0; }
    get x0() { return this.rect.x0; }
    get y0() { return this.rect.y0; }
    get x1() { return this.rect.x1 }
    get y1() { return this.rect.y1 }
    get w() { return this.rect.w; }
    get h() { return this.rect.h; }
    get X() { return this.X0; }
    get Y() { return this.Y0; }
    get X0() { return this.x0 + (this.parent ? this.parent.x0 : 0); }
    get Y0() { return this.y0 + (this.parent ? this.parent.y0 : 0); }
    get X1() { return this.X0 + this.W - 1; }
    get Y1() { return this.Y0 + this.H - 1; }
    get W() { return this.rect.w; }
    get H() { return this.rect.h; }

    inBounds(x, y, dx = 0, dy = 0) {
        // console.log("inbounds", this.name, this.X0, this.Y0,  - dx / 2, x, this.x1 + dx / 2, this.y0 - dy / 2, y, this.y1 + dy / 2);
        let result = _between(- dx / 2, x, this.w + dx / 2) && _between(- dy / 2, y, this.h + dy / 2);
        return result;
    }
    _addAgent(agent) {
        this._.agents.push(agent);
    }
    _makeable(parent, agentNames) {
        agentNames = GArrays.ensureArray(agentNames);
        let agents = parent._.agents.filter(agent => agentNames.indexOf(agent.name) >= 0);
        for(let agent of agents) {
            // console.log("_makeable", agent.name, parent.name, this.name, agentNames);
            agent.add(this);
        }
    }
    add(child, relrect) {
        let parent = this;
        let parentPrivate = this._;
        parentPrivate.children.unshift(child);
        child._.parent = parent;
        child._.root = parentPrivate.root;
        if (relrect) {
            child._.relrect = relrect;
            child._.rect = relrect.scale(parentPrivate.rect);
            child._recompute;
        }
    }
    box(x0, y0, w, h, borderColor, fillColor) {
        this.parent.box(this.x0 + x0, this.y0 + y0, w, h, borderColor, fillColor);
    }
    text(text, x0, y0, textStyle, w, h) {
        this.parent.text(text, this.x0 + x0, this.y0 + y0, textStyle, w, h);
    }
    move(x0, y0, x1, y1) {
        this._.relrect.move(x0, y0, x1, y1);
    }
    resize(w, h) {
        this._.relrect.resize(w, h);
    }
    draw() {
        // console.log(this._.name, this.x0, this.y0, this.x1, this.y1, this.w, this.h);
        let p = this._;
        this.box(0, 0, this.w, this.h, this._.color, this._.backgroundColor)
        this.text(p.name, 0, 0, null, this.w, this.h);
        for (let child of this._.children) {
            child.draw();
        }
    }
}