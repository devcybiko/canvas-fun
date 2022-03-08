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