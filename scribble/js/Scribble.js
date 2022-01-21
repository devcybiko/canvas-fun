class Scribble extends PObject {
  static {
    this.mixin({ GraphicsMixin });
    this.mixin({ LoggingMixin });
  }
  _init(args) {
    args = Mixin.getArgs(arguments, { canvasId: String, tick: 125 });
    const playfield = Playfield.factory(args.canvasId);
    super._init(playfield);
    this._args = args;
    playfield.resize();
    this._x0 = null;
    this._y0 = null;
    this._x1 = null;
    this._y1 = null;
    this.objs = [];
    this.rubberBand = null;
  }
  onDragStart(x, y, mousex, mousey) {
    this._x0 = mousex;
    this._y0 = mousey;
    this.rubberBand = Box.factory(this._playfield, mousex, mousey, 0, 0);
  }
  onDragStop(x, y, mousex, mousey) {
    this._x1 = mousex;
    this._y1 = mousey;
    this.rubberBand.resize(mousex - rubberBand.x, this.rubberBand.y);
    this._playfield.redraw();
    this._x0 = null;
    this._y0 = null;
    this._x1 = null;
    this._y1 = null;
  }
  onDrag(x, y, mousex, mousey, event) {
    if (this._x0 === null) return;
    this.rubberBand.resize(mousex - this.rubberBand.x, mousey - this.rubberBand.y);
    this._playfield.redraw();
  }
  onResize(x, y, w, h) {
    this.move(x, y);
    this.resize(w, h);
  }
}

class Box extends PObject {
  static {
    this.mixin({ GraphicsMixin });
    this.mixin({ LoggingMixin });
  }
  _init(args) {
    super._init(args);
    console.log(args)
  }
  draw() {
    this.rect({x:this.x, y:this.y, w:this.w, h:this.h});
  }
}