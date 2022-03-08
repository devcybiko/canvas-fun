class Group extends PObject {
    static {
      this.mixin({ LoggingMixin });
    }
    _init(args) {
      args = Mixin.getArgs(arguments, { name: "", text: "", x: 50, y: 50, w: 500, h: 500, selected: false });
      super._init({ name: args.name, x: args.x, y: args.y, w: args.w, h: args.h, selected: args.selected });
      this._text = args.text;
      this._showBorder = false;
    }
    onEnter() {
        this._showBorder = true;
    }
    onExit() {
        this._showBorder = false;
    }
    add(child) {
      child._ctx = this._ctx;
      this.addChild(child);
    }
    onDrop(obj) {
        console.log("DROP", obj)
        this.getPlayfield().removeChild(obj);
        this.add(obj);
    }
    onDraw() {
      let cnt = 0;
      for(let child of this.getChildren()) {
        console.log(cnt++, child)
        child.onDraw();
      }
      if (this._isHovering) {
        this.rect({x: this.x, y: this.y, w: this.w, h: this.h})
      }
    }
  }