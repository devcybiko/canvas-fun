class PObject extends Rect {
    _init(args) {
        args = Mixin.getArgs(arguments, { name: "", color: "black", x: 0, y: 0, w: 100, h: 100, borderColor: "red", selected: false, isVisible: true });
        this._name = args.name;
        this._ctx = null;
        this._color = args.color;
        this._borderColor = args.borderColor;
        this._x = args.x;
        this._y = args.y;
        this._w = args.w;
        this._h = args.h;
        this._timer = 0;
        this._callback = null;
        this._oldX = 0;
        this._oldY = 0;
        this._isHovering = false;
        this._isSelected = args.selected;
        this._isVisible = args.isVisible;
        this._isClicked = false;
        this._isDragging = false;

        this._xPercent, this._yPercent, this._wPercent, this._hPercent = 0;
    }
    _onClickDown(event) {
        let dx = event.playfieldX - this.X;
        let dy = event.playfieldY - this.Y;
        this.debug(event.clicked)
        if (this.inBounds(event.playfieldX, event.playfieldY) && !event.clicked) {
            event.clicked = this;
            this._isClicked = true;
            this.onClick(dx, dy, event);
        }
    }
    _onClickUp(event) {
        let dx = event.playfieldX - this.x;
        let dy = event.playfieldY - this.y;
        this.onClickUp(dx, dy, event);
        this._isClicked = false;
    }
    _onMotion(event) {
        let dx = event.playfieldX - this.x;
        let dy = event.playfieldY - this.y;
        if (this._isHovering) {
            if (this.inBounds(event.playfieldX, event.playfieldY)) {
                if (event.hoverer) {
                    this._isHovering = false;
                    this.onExit(dx, dy, event);
                } else {
                    event.hoverer = this;
                    this.onHover(dx, dy, event);
                }
            } else {
                this._isHovering = false;
                this.onExit(dx, dy, event);
            }
        } else {
            if (this.inBounds(event.playfieldX, event.playfieldY)) {
                if (!event.hoverer) {
                    this._isHovering = true;
                    event.hoverer = this;
                    this.onEnter(dx, dy, event);
                }
            }
        }
    }
    _relativeMove(xPercent, yPercent) {
        this._xPercent = xPercent;
        this._yPercent = yPercent;
        let x = Math.floor(this.getParent().X + this.getParent().W * xPercent);
        let y = Math.floor(this.getParent().Y + this.getParent().H * yPercent);
        this.move(x, y);
    }
    _relativeResize(wPercent, hPercent) {
        this._wPercent = wPercent;
        this._hPercent = hPercent;
        let w = Math.floor(this.layout.w * wPercent);
        let h = Math.floor(this.layout.h * hPercent);
        this.resize(w,h);
    }

    isInFront() {
        let children = this.getPlayfield().getChildren();
        if (children.indexOf(this) === children.length - 1) return true;
        return false;
    }
    onHover(dx, dy, event) { }; // abstract method
    onClick(dx, dy, event) {
        this.dragStart(event);
        // _log("XXX CLICK!")
    } // abstract method
    onClickUp(dx, dy, event) { } // abstract method
    onMenu(dx, dy, event) { } // abstracte method
    onMenuUp(dx, dy, event) { } // abstracte method
    onDrag(dx, dy, event) {
        this.move(this._oldX + dx, this._oldY + dy);
    }
    onDragStop(x, y) { } // abstract method
    onTick() { } // abstract method
    onKeyDown(key, event) { } // abstract method
    onResize(x, y, w, h) { }
    onDraw(ctx) { } // abstract method
    onEnter(dx, dy, event) { }
    onExit(dx, dy, event) { }

    get x() { return this._x; }
    get y() { return this._y; }
    get x0() { return this._x; }
    get y0() { return this._y; }
    get x1() { return this.x0 + this.w; }
    get y1() { return this.y0 + this.h; }
    get w() { return this._w; }
    get h() { return this._h; }

    get X() { return this._x + this._parent.X; }
    get Y() { return this._y + this._parent.Y; }
    get X0() { return this._x + this._parent.X0; }
    get Y0() { return this._y + this._parent.Y0; }
    get X1() { return this.X0 + this._w; }
    get Y1() { return this.Y0 + this._h; }
    get W() { return this._w; }
    get H() { return this._h; }

    get isVisible() { return this._isVisible; }
    dragStart(event) {
        this._oldX = this.x;
        this._oldY = this.y;
        this.getPlayfield().dragStart(this, event);
    }
    toBack() {
        this.getParent().toBack(this);
    }
    toFront() {
        this.getParent().toFront(this);
    }
    hide() {
        this._isVisible = false;
    }
    show() {
        this._isVisible = true;
    }
    inBounds(x, y) {
        this.debug(this.X0, x, this.X1);
        this.debug(this.Y0, y, this.Y1);
        let result = _between(this.X0 - ANCHOR_SIZE / 2, x, this.X1 + ANCHOR_SIZE / 2) && _between(this.Y0 - ANCHOR_SIZE / 2, y, this.Y1 + ANCHOR_SIZE / 2);
        this.debug(result)
        return result;
    }
    setTimer(ms, callback, context) {
        if (ms === 0) {
            this._timer = 0;
        } else {
            let now = new Date().getTime();
            this._timer = now + ms;
            this._callback = callback;
            this._context = context;
        }
    }
    getTimer() {
        if (!this._timer) return 0;
        let now = new Date().getTime();
        let delta = this._timer - now;
        if (delta > 0) return delta;
        this._timer = 0;
        if (this._callback) this._callback(this._context)
        return 0;
    }
    getPlayfield() {
        let playfield = this.getParent();
        while (playfield.getParent()) playfield = this.getParent();
        return playfield;
    }
    move(x, y, w, h) {
        this._x = x;
        this._y = y;
        if (w !== undefined) this._w = w;
        if (h !== undefined) this._h = h;
    }
    resize(w, h, x, y) {
        this._w = w;
        this._h = h;
        if (x !== undefined) this._x = x;
        if (y !== undefined) this._y = y;
    }
    select(on_off) {
        if (on_off) {
            for (let child of this.getParent().getChildren()) child._isSelected = false;
        }
        this._isSelected = on_off;
    }
    redraw() {
        this.getParent().redraw();
    }
    add(child) {
        this.addChild(child);
        child._ctx = this._ctx;
    }
}
Mixin.mixin(PObject, { NodeMixin, GraphicsMixin, LoggingMixin });

