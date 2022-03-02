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