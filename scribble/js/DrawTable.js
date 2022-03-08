class DrawTable extends PObject {
    static {
      Mixin.mixin({ GraphicsMixin });
    }
    _init(args) {
      args = Mixin.getArgs(arguments, { scribble: Scribble });
      super._init();
      this._debug = true;
      this._x0 = null;
      this._y0 = null;
      this._x1 = null;
      this._y1 = null;
      this.objs = [];
      this._name = "drawTable";
      this.rubberBand = null;
      this.list = [];
    }
    onResize(x, y, w, h) {
      let oldW = this.w;
      let oldH = this.h;
  
      // if (w !== h) {
      //   let r = Math.min(w, h);
      //   this.getParent().resize(x, y, r, r);
      //   return;
      // }
      y = this.getPlayfield().getData().scribble.menu.h;
      this.move(x, y);
      this.resize(w, h);
      for (let obj of this.list) {
        let ratioW = w / oldW;
        let ratioH = h / oldH;
        obj.move(obj.x * ratioW, obj.y * ratioH, obj.w * ratioW, obj.h * ratioH)
      }
      this.redraw();
    }
    onHover() {
    }
    onClick(dx, dy, event) {
      this.toBack();
      let x = event.playfieldX;
      let y = event.playfieldY;
      if (choose === "Rectangle") this.rubberBand = Box.factory({ name: "box-" + count, x: x-DEFAULT_SIZE, y: y-DEFAULT_SIZE, w: DEFAULT_SIZE, h: DEFAULT_SIZE });
      else if (choose === "Circle") this.rubberBand = Circle.factory({ name: "circle-" + count, x: x-DEFAULT_SIZE, y: y-DEFAULT_SIZE, w: DEFAULT_SIZE, h: DEFAULT_SIZE });
      else return;
      this.rubberBand.scribble = this;
      count++;
      this.getPlayfield().add(this.rubberBand);
      this.list.push(this.rubberBand);
      this.rubberBand.onClick(DEFAULT_SIZE, DEFAULT_SIZE, event);
    }
    onDragStop(dx, dy, event) {
        return;
      if (dx < 20 || dy < 20) {
        this.getPlayfield().removeChild(this.rubberBand);
        count--;
      }
      this.list.push(this.rubberBand);
      this.rubberBand.onClick(dx, dy, event);
      this._x0 = null;
      this._y0 = null;
      this._x1 = null;
      this._y1 = null;
      this.rubberBand = null;
    }
    onDrag(dx, dy, event) {
        return;
      if (this.rubberBand === null) return;
      if (dx < ANCHOR_SIZE) {
        this.rubberBand._x = event.playfieldX;
        this.rubberBand._w = Math.max(-dx, ANCHOR_SIZE);
      } else {
        this.rubberBand._w = Math.max(ANCHOR_SIZE, dx);
      }
      if (dy < ANCHOR_SIZE) {
        this.rubberBand._y = event.playfieldY;
        this.rubberBand._h = Math.max(-dy, ANCHOR_SIZE);
      } else {
        this.rubberBand._h = Math.max(ANCHOR_SIZE, dy);
      }
      this.getPlayfield().redraw();
    }
    onMenu() {
      if (choose === "box") choose = "circle";
      else choose = "box";
    }
    onDraw() {
      this.line(this.X, this.Y, this.W, this.H);
      this.line(this.W, this.Y, this.X, this.H);
    }
  }