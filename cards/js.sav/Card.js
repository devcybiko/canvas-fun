class Card extends Sprite {
    _init(args) {
      args = Mixin.getArgs(arguments, { bitmap: ImageBitmap, backBitmap: ImageBitmap, name: "", x: 0, y: 0, selected: false, suit: String, face: String, value: Number, isVisible: false });
      [this._suit, this._face, this._value, this._backBitmap] = _delete(args, "suit", "face", "value", "backBitmap", "_args_", "_sealed_");
      super._init(args);
      this._faceup = true;
      this._faceBitmap = this._bitmap;
    }
    onClick() {
        this.toFront();
        super.onClick(...arguments);
    }
    setFaceUp(faceup) {
      if (faceup) {
        this._faceup = true;
        this._bitmap = this._faceBitmap;
      } else {
        this._faceup = false;
        this._bitmap = this._backBitmap;
      }
    }
}
// Mixin.mixin(Card, { GraphicsMixin })