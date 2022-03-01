
const ANCHOR_SIZE = 5;
const DEFAULT_SIZE = 50;
let choose = "Circle";
let count = 0;

class Scribble extends Mixin {
  _init(args) {
    args = Mixin.getArgs(arguments, { canvasId: String, tick: 125 });
    this.playfield = Playfield.factory({ canvasId: args.canvasId, tick: 125, fullScreen: true });
    this.buildScribble(this.playfield);
    this.playfield._data.scribble = this;
    this.playfield.resize();
    // playfield.start();
  }
  buildScribble(playfield) {
    this.buildDrawTable(playfield);
    this.buildMenu(playfield);
    this.group = Group.factory();
    playfield.add(this.group);
  }
  buildDrawTable(playfield) {
    this.drawTable = DrawTable.factory(this);
    playfield.add(this.drawTable)
    this.drawTable.toBack();
  }
  buildMenu(playfield) {
    this.menu = PLayout.factory({ name: "menu", xPercent: 0, yPercent: 0, wPercent: 1.0, hPercent: 25 });
    playfield.add(this.menu);
    this.homeButton = Button.factory({ name: "home", text: "Home", x: 0, y: 0, w: 10, h: 10 });
    this.rectButton = Button.factory({ name: "rect", text: "Rectangle", x: 0, y: 0, w: 10, h: 10 });
    this.circleButton = Button.factory({ name: "circle", text: "Circle", x: 0, y: 0, w: 10, h: 10, selected: true });
    this.menu.add(this.homeButton, 0, 0, 0.25, 1);
    this.menu.add(this.rectButton, 0.25, 0, 0.25, 1);
    this.menu.add(this.circleButton, 0.50, 0, 0.25, 1);
    this.menu.toBack();
  }
  reset() {
    for (let obj of this.drawTable.list) {
      this.playfield.removeChild(obj);
    }
    this.drawTable.list = [];
  }
}
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
    this.getPlayfield().add(this.rubberBand);
    this.rubberBand.scribble = this;
    count++;
    this.list.push(this.rubberBand);
    this.rubberBand.onClick(DEFAULT_SIZE, DEFAULT_SIZE, event);
  }
  onDragStop(dx, dy, event) {
    if (dx < 20 || dy < 20) {
      this.getPlayfield().removeChild(this.rubberBand);
      count--;
    }
    // let oldchild = this.getParent().removeChild(this.rubberBand);
    // console.log("oldChild", oldchild)
    // console.log("children", this.getParent().getChildren());
    //this.group.add(this.rubberBand);
    this.list.push(this.rubberBand);
    this._x0 = null;
    this._y0 = null;
    this._x1 = null;
    this._y1 = null;
    this.rubberBand = null;
  }
  onDrag(dx, dy, event) {
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
    this.line(this.x, this.y, this.w, this.h);
    this.line(this.w, this.y, this.x, this.h);
  }
}

class BaseClass extends PObject {
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

class Box extends BaseClass {
  _init(args) {
    super._init(...arguments);
    this.scribble = null;
  }
  onDraw() {
    console.log(this.getRect())
    this.text({ text: this._name, x: this.x, y: this.y, w: this.w, h: this.h });
    if (this._isHovering || this._isDragging) {
      let a2 = ANCHOR_SIZE / 2;
      let a = ANCHOR_SIZE;
      let w2 = this.w / 2;
      let h2 = this.h / 2;
      let cx = this.x + w2;
      let cy = this.y + h2;
      this.rect({ x: this.x - a2, y: this.y - a2, w: a, h: a })
      this.rect({ x: cx - a2, y: this.y - a2, w: a, h: a })
      this.rect({ x: this.x + this.w - a2, y: this.y - a2, w: a, h: a })
      this.rect({ x: this.x - a2, y: this.y + h2 - a2, w: a, h: a })
      this.rect({ x: this.x + this.w - a2, y: this.y + h2 - a2, w: a, h: a })
      this.rect({ x: this.x - a2, y: this.y + this.h - a2, w: a, h: a })
      this.rect({ x: cx - a2, y: this.y + this.h - a2, w: a, h: a })
      this.rect({ x: this.x + this.w - a2, y: this.y + this.h - a2, w: a, h: a })
    }
  }

}

class Circle extends BaseClass {
  _init(args) {
    super._init(...arguments);
    this.scribble = null;
  }
  onDraw() {
    console.log(this.getRect())
    this.ellipse({ x: this.x, y: this.y, w: this.w, h: this.h });
    this.text({ text: this._name, x: this.x, y: this.y, w: this.w, h: this.h, fillColor: "", borderColor: "" });
    if (this._isHovering || this._isDragging) {
      let a2 = ANCHOR_SIZE / 2;
      let a = ANCHOR_SIZE;
      let w2 = Math.floor(this.w / 2);
      let h2 = Math.floor(this.h / 2);
      let cx = this.x + w2;
      let cy = this.y + h2;
      let x0 = ellipseX(135, w2);
      let y0 = ellipseY(135, h2);

      // console.log(cx, cy, x0, y0, cx + x0, cy + y0)
      // this.rect({ x: cx + x0 - a2, y: cy + y0 - a2, w: a, h: a });
      // this.rect({ x: cx + x0 - a2, y: cy - y0 - a2, w: a, h: a });
      // this.rect({ x: cx - x0 - a2, y: cy + y0 - a2, w: a, h: a });
      // this.rect({ x: cx - x0 - a2, y: cy - y0 - a2, w: a, h: a });

      this.rect({ x: cx - a2, y: this.y - a2, w: a, h: a })
      this.rect({ x: this.x - a2, y: this.y + h2 - a2, w: a, h: a })
      this.rect({ x: this.x + this.w - a2, y: this.y + h2 - a2, w: a, h: a })
      this.rect({ x: cx - a2, y: this.y + this.h - a2, w: a, h: a })
    }
  }
  inBounds(x, y) {
    let cx = Math.floor(this.x + this.w / 2);
    let cy = Math.floor(this.y + this.h / 2);
    let dx = cx - x;
    let dy = cy - y;
    let left = squared(dx) / squared((this.w + 10) / 2);
    let right = squared(dy) / squared((this.h + 10) / 2);
    let sum = left + right;
    let inside = sum < 1;
    return inside;
  }

}
function squared(a) { return a * a }
function toRadians(d) { return Math.PI * d / 180; }
function ellipseX(angle, width) { return Math.floor(Math.cos(toRadians(angle)) * width); }
function ellipseY(angle, height) { return Math.floor(Math.sin(toRadians(angle)) * height); }

class Button extends PObject {
  static {
    this.mixin({ GraphicsMixin, LoggingMixin });
  }

  _init(args) {
    args = Mixin.getArgs(arguments, { name: "", text: "", x: 0, y: 0, w: 0, h: 0, selected: false });
    super._init({ name: args.name, x: args.x, y: args.y, w: args.w, h: args.h, selected: args.selected });
    this._text = args.text;
  }
  setText(text) {
    this._text = text;
    this.toFront();
  }
  onEnter() {
    this.redraw();
  }
  onExit() {
    this.redraw();
  }
  onDraw() {
    if (this._name) {
      let fillColor = "";
      if (this._isHovering) fillColor = "yellow";
      if (this._isSelected) fillColor = "gray";
      this.text({ x: this.X0, y: this.Y0, w: this.W, h: this.H, text: this._text, fillColor: fillColor });
    }
  }
  onClick() {
    if (this._text === "Home") {
      this.getPlayfield().getData().scribble.reset();
      this.redraw();
      count = 0;
    } else {
      choose = this._text;
      this.select(true);
    }
  }
}

class Group extends PObject {
  static {
    this.mixin({ LoggingMixin });
  }
  _init(args) {
    args = Mixin.getArgs(arguments, { name: "", text: "", x: 0, y: 0, w: 0, h: 0, selected: false });
    super._init({ name: args.name, x: args.x, y: args.y, w: args.w, h: args.h, selected: args.selected });
    this._text = args.text;
  }
}