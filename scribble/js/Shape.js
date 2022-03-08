class Shape extends PObject {
    static {
      this.mixin({ GraphicsMixin, LoggingMixin });
    }
    _init(args) {
      super._init(...arguments);
      this._anchor = null;
    }
    upper(x, y) {
      return _between(-ANCHOR_SIZE, y, ANCHOR_SIZE);
    }
    lower(x, y) {
      return _between(this.h - ANCHOR_SIZE, y, this.h + ANCHOR_SIZE);
    }
    left(x, y) {
      return _between(-ANCHOR_SIZE, x, ANCHOR_SIZE);
    }
    right(x, y) {
      return _between(this.w - ANCHOR_SIZE, x, this.w + ANCHOR_SIZE);
    }
    upperLeft(x, y) {
      return this.upper(x, y) && this.left(x, y);
    }
    lowerLeft(x, y) {
      return this.lower(x, y) && this.left(x, y);
    }
    upperRight(x, y) {
      return this.upper(x, y) && this.right(x, y);
    }
    lowerRight(x, y) {
      return this.lower(x, y) && this.right(x, y);
    }
    hitAnchor(x, y) {
      let upper = this.upper(x, y);
      let lower = this.lower(x, y);
      let left = this.left(x, y);
      let right = this.right(x, y);
      let hits = { upper, lower, left, right }
      if (upper || lower || left || right) return hits;
      return false;
    }
    onClick(dx, dy, event) {
      if (this._anchor) this._anchor = null;
      let edges = this.hitAnchor(dx, dy);
      if (edges) {
        edges.w = this.w;
        edges.h = this.h;
        edges.x = this.x;
        edges.y = this.y;
        this._anchor = edges;
      }
      this.dragStart(event);
      if (event.shiftKey) {
        this.toBack();
        this.getPlayfield()._data.scribble.drawTable.toBack();
      } else {
        this.toFront();
      }
    }
    onDrag(dx, dy, event) {
      if (this._anchor) {
        console.log("onDrag", dx, this._anchor.x, this._anchor.w, this._anchor.left, this._anchor.right)
        if (this._anchor.left) {
          this._w = this._anchor.w - dx;
          this._x = this._anchor.x + dx;
          if (this._w < 0) {
            this._w = 0;
            this.dragStart(event);
            this._anchor.left = false;
            this._anchor.right = true;
            this._anchor.x = this.x;
            this._anchor.y = this.y;
            this._anchor.w = this.W;
            this._anchor.h = this.h;
          }
        }
        if (this._anchor.right) {
          this._w = this._anchor.w + dx;
          if (this._w < 0) {
            this._w = 0;
            this.dragStart(event);
            this._anchor.left = true;
            this._anchor.right = false;
            this._anchor.x = this.x;
            this._anchor.y = this.y;
            this._anchor.w = this.w;
            this._anchor.h = this.h;
          }
        }
        if (this._anchor.upper) {
          this._h = this._anchor.h - dy;
          this._y = this._anchor.y + dy;
          if (this._h < 0) {
            this._h = 0;
            this.dragStart(event);
            this._anchor.upper = false;
            this._anchor.lower = true;
            this._anchor.x = this.x;
            this._anchor.y = this.y;
            this._anchor.w = this.w;
            this._anchor.h = this.h;
          }
        }
        if (this._anchor.lower) {
          this._h = this._anchor.h + dy;
          if (this._h < 0) {
            this._h = 0;
            this.dragStart(event);
            this._anchor.upper = true;
            this._anchor.lower = false;
            this._anchor.x = this.x;
            this._anchor.y = this.y;
            this._anchor.w = this.w;
            this._anchor.h = this.h;
          }
        }
      } else {
        super.onDrag(dx, dy, event);
      }
      this.getPlayfield().redraw();
    }
    onDragStop(dx, dy, event) {
      // if (this.w < ANCHOR_SIZE || this.h < ANCHOR_SIZE) {
      //   this.getPlayfield().removeChild(this);
      // }
    }
    onEnter() {
      this.redraw();
    }
    onExit() {
      this.redraw();
    }
    onHover() {
      this.redraw();
    }
  }