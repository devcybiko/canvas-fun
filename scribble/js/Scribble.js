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
  }
}
