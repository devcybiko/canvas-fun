class PCanvasEventStream {
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        this._ = {};
    }
    _init(args) {
        let p = this._;
        p.canvas = document.querySelector(args.canvasId) || document.querySelector("#" + args.canvasId);
        if (!p.canvas) throw Error(`Could not find Canvas='${args.canvasId}' in DOM`);
        p.children = [];
        p.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        p.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        p.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        // p.canvas.addEventListener("touchstart", p.handleMouseDown.bind(this), { capture: true, passive: false });
        // p.canvas.addEventListener("touchend", p.handleMouseUp.bind(this), { capture: true, passive: false });
        // p.canvas.addEventListener("touchcancel", p.handleMouseUp.bind(this), { capture: true, passive: false });
        // p.canvas.addEventListener("touchmove", p.handleMouseMove.bind(this), { capture: true, passive: false });
        return this;
    }
    _updateEvent(event) {
        event.preventDefault();
        event.stopPropagation();
        if (event.targetTouches && event.targetTouches[0]) {
            event.playfieldX = event.targetTouches[0].pageX - event.srcElement.offsetLeft;
            event.playfieldY = event.targetTouches[0].pageY - event.srcElement.offsetTop;
        } else {
            event.playfieldX = event.offsetX;
            event.playfieldY = event.offsetY;    
        }
    }
    _dispatchEventAcrossPlayfields(eventType, event) {
        this._updateEvent(event);
        let stop = false;
        for (let child of this.children) {
            if (stop) break;
            event.isDirty = false;
            stop = child._dispatchAgents(eventType, event);
        }
        return stop;
    }

    get children() {return this._.children;}

    add(pobj) {
        this._.children.unshift(pobj)
    }

    handleMouseDown(event) {
        if (event.button === 0 || event.type === "touchstart") {
            this._dispatchEventAcrossPlayfields("onClick", event)
        } else if (event.button === 2) {
            // this._dispatchEvent("_onMenu", event, this.children);
        }
    }
    handleMouseUp(event) {
        event.preventDefault();
        event.stopPropagation();
        if (event.button === 0 || event.type === "touchend") {
            this._dispatchEventAcrossPlayfields("onClickUp", event)
        } else if (event.button === 2) {
            // this._dispatchEvent("_onMenuUp", event, this.children.reverse());
        }
    }
    handleMouseMove(event) {
        event.preventDefault();
        event.stopPropagation();
        // this._dispatchEventAcrossPlayfields("onMotion", event)
    }}