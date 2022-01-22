class BaseClass extends PObject {
  static {
    this.mixin({ GraphicsMixin, LoggingMixin });
  }
  onClick(x, y, mouseX, mouseY, event) {
    this.dragStart(event);
    this.toFront();
  }
  redraw() {
    this.getParent().redraw();
  }

  onHover() {
    // let colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
    // let i = colors.indexOf(this._fillColor);
    // i++;
    // if (i >= colors.length) i = 0;
    // this._fillColor = colors[i];
    // this.redraw();
  }
}

let choose = "Circle";
let count = 0;

class Scribble extends PObject {
  _init(args) {
    args = Mixin.getArgs(arguments, { canvasId: String, tick: 125 });
    const playfield = Playfield.factory({ canvasId: args.canvasId, tick:125, fullScreen: true });
    super._init({parent: playfield});
    this._args = args;
    this._x0 = null;
    this._y0 = null;
    this._x1 = null;
    this._y1 = null;
    this.objs = [];
    this._name = "\nscribble";
    this._isDraggable = true;
    this.rubberBand = null;
    this.menu = PLayout.factory({ parent: playfield, name: "menu", xPercent: 0.0, yPercent: 0.0, wPercent: 100.0, hPercent: 10.0 });
    // this.body = PLayout.factory({ parent: playfield, name: "body", xPercent: 0.0, yPercent: 10.0, wPercent: 100.0, hPercent: 90.0 });
    this.homeButton = Button.factory({ parent: playfield, name: "home", text: "Home", x: 0, y: 0, w: 10, h: 10 });
    this.rectButton = Button.factory({ parent: playfield, name: "rect", text: "Rectangle", x: 0, y: 0, w: 10, h: 10 });
    this.circleButton = Button.factory({ parent: playfield, name: "circle", text: "Circle", x: 0, y: 0, w: 10, h: 10 });
    this.menu.add(this.homeButton, 0, 0, 25, 100);
    this.menu.add(this.rectButton, 25, 0, 25, 100);
    this.menu.add(this.circleButton, 50, 0, 25, 100);
    this.redraw();
    this.toBack();
    this.getParent().resize();
    // this.getPlayfield().start();
  }
  onResize(x, y, w, h) {
    console.log("RESIZE", x, y, w, h)
    if (w !== h) {
      let r = Math.min(w, h);
      this.getParent().resize(x, y, r, r);
      return;
    }
    this.move(x, y);
    this.resize(w, h);
  }
  onClick(x, y, mousex, mousey, event) {
    console.log("onClick");
    this.toBack();
    this._x0 = mousex;
    this._y0 = mousey;
    if (choose === "Rectangle") this.rubberBand = Box.factory({ parent: this.getParent(), name: "box-"+count, x: mousex, y: mousey, w: 1, h: 1 });
    else if (choose === "Circle") this.rubberBand = Circle.factory({ parent: this.getParent(), name: "circle-"+count, x: mousex, y: mousey, w: 1, h: 1 });
    else return;
    this.rubberBand.scribble = this;
    count++;
    this.dragStart(event)
  }
  onDragStop(x, y, mousex, mousey) {
    console.log("onDragStop");
    if (!this.rubberBand) return;
    this._x1 = mousex;
    this._y1 = mousey;
    this.rubberBand.resize(mousex - this.rubberBand.x, mousey - this.rubberBand.y);
    this.getParent().redraw();
    this._x0 = null;
    this._y0 = null;
    this._x1 = null;
    this._y1 = null;
    this.rubberBand = null;
  }
  onDrag(x, y, mousex, mousey, event) {
    const MIN_SIZE = 10;
    if (this._x0 === null) return;
    if (x < MIN_SIZE) {
      this.rubberBand._x = mousex;
      this.rubberBand._w = Math.max(-x, MIN_SIZE);
    } else {
      this.rubberBand._w = Math.max(5, x);
    }
    if (y < MIN_SIZE) {
      this.rubberBand._y = mousey;
      this.rubberBand._h = Math.max(-y, MIN_SIZE);
    } else {
      this.rubberBand._h = Math.max(MIN_SIZE, y);
    }
    this.rubberBand.redraw() 
  }
  onMenu() {
    if (choose === "box") choose = "circle";
    else choose = "box";
  }
  redraw() {
    console.log("Scribble.redraw");
    this.getParent().redraw();
  }
  onDraw() {
    this.toBack();
  }
}

class Box extends BaseClass {
  _init(args) {
    super._init(...arguments);
    this.scribble = null;
  }
  onDraw() {
    this.text({ text: this._name, x: this.x, y: this.y, w: this.w, h: this.h });
  }

}

class Circle extends BaseClass {
  _init(args) {
    super._init(...arguments);
    this.scribble = null;
  }
  onDraw() {
    this.ellipse({ x: this.x, y: this.y, w: this.w, h: this.h });
    this.text({text: this._name, x: this.x, y: this.y, w:this.w, h:this.h, fillColor : "", borderColor: ""});
  }
}

class Button extends PObject {
  static {
    this.mixin({ GraphicsMixin, LoggingMixin });
  }

  _init(args) {
    args = Mixin.getArgs(arguments, { parent: Node, name: "", text: "", x: 0, y: 0, w: 0, h: 0 });
    super._init({ parent: args.parent, name: args.name, x: args.x, y: args.y, w: args.w, h: args.h });
    this._text = args.text;
  }
  setText(text) {
    this._text = text;
    this.toFront();
  }
  onDraw() {
    console.log(this._name, this.X0, this.Y0, this.W, this.H, this._parent.X0, this._parent.Y0)
    if (this._name) {
      this.text(this._name, this.X0, this.Y0, this.W, this.H);
    }
  }
  onClick() {
    choose = this._text;
    alert(choose);    
  }
}