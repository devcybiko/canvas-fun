class Card extends Sprite {
    static {
      Mixin.mixin({ GraphicsMixin });
    }
    _init(args) {
      args = Mixin.getArgs(arguments, { bitmap: ImageBitmap, name: "", x: 0, y: 0, selected: false, suit: String, face: String, value: Number });
      [this._suit, this._face, this._value] = _delete(args, "suit", "face", "value", "_args_", "_sealed_");
      super._init(args);
    }
    onClick() {
        this.toFront();
        super.onClick(...arguments);
    }
}