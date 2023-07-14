class PObject extends Rect {
    static {
        Mixin.mixin({ Tree, LoggingMixin });
    }
    _defaults = {
    };
    _init(args) {
        args = Mixin.getArgs(arguments, { name: "", color: "black", x: 0, y: 0, w: 100, h: 100, borderColor: "red", selected: false });
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
        this._isVisible = true;
        this._isClicked = false;
        this._isDragging = false;
    }
    _onClickDown(event) {
        let dx = event.playfieldX - this.x;
        let dy = event.playfieldY - this.y;
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
    _onDragStop(dx, dy, event) {
        console.log("_onDragStop", event.playfieldX, event.playfieldY);
        let hitObjects = this.getPlayfield()._findObjectsInBounds(event.playfieldX, event.playfieldY, this);
        console.log(hitObjects);
        if (hitObjects.length) hitObjects[0].onDrop(this);
        this.onDragStop(dx, dy, event)
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
    isInFront() {
        let children = this.getPlayfield().getChildren();
        if (children.indexOf(this) === children.length - 1) return true;
        return false;
    }
    onHover(dx, dy, event) { }; // abstract method
    onClick(dx, dy, event) {
        this.dragStart(event);
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
    onDrop(obj) { this.debug("onDrop")}

    get x() { return this._x; }
    get y() { return this._y; }
    get x0() { return this._x; }
    get y0() { return this._y; }
    get x1() { return this.x0 + this.w; }
    get y1() { return this.y0 + this.h; }
    get w() { return this._w; }
    get h() { return this._h; }

    get X() { return this.getParent().x + this._x; }
    get Y() { return this.getParent().y + this._y; }
    get X0() { return this.X; }
    get Y0() { return this.Y; }
    get X1() { return this.X + this._w; }
    get Y1() { return this.Y + this._h; }
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
        let result = _between(this.x0 - ANCHOR_SIZE / 2, x, this.x1 + ANCHOR_SIZE / 2) && _between(this.y0 - ANCHOR_SIZE / 2, y, this.y1 + ANCHOR_SIZE / 2);
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
    }
}