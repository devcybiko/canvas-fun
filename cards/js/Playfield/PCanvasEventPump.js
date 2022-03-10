class PCanvasEventPump {
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
        p.fullScreen = true;
        p.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        p.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        p.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        window.onresize = this.handleWindowResize.bind(this);

        p.resizeHysterisis = 50;
        p.resizeTimerId = null;
        p.dWidth = 20;
        p.dHeight = 20;
        this.resize();
    
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
            if (event.isDirty) child.draw();
        }
        return stop;
    }

    get children() { return this._.children; }

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
        this._dispatchEventAcrossPlayfields("onMotion", event)
    }
    handleWindowResize(event) {
        this._updateEvent(event);
        this.resize(undefined, undefined, undefined, undefined, event);
    }
    resize(x, y, w, h, event) {
        let p = this._;
        console.log(x,y,w,h)
        if (x === undefined) {
            // browser resized - resize the canvas to the size of this window
            if (p.resizeTimerId) clearTimeout(p.resizeTimerId);
            // its not a good idea to resize as the window is resizing, so wait a 'tick' before resizing the entire viewport
            p.resizeTimerId = setTimeout(this.resize.bind(this), p.resizeHysterisis, 0, 0, window.innerWidth, window.innerHeight, event);
            return;
        }
        p.resizeTimerId = null;
        console.log(w,h);
        p.canvas.x = x;
        p.canvas.y = y;
        p.canvas.width = w - p.dWidth;
        p.canvas.height = h - p.dHeight;
        for(let child of p.children) {
            child.resize(w, h);
            child.draw();
        }
    }
}