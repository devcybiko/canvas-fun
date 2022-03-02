class Menu extends PLayout {
    _init(args) {
        this.msg("Menu");
        args = Mixin.getArgs(arguments, { name: "menu", xPercent: 0, yPercent: 0, wPercent: 1.0, hPercent: 25 });
        [this._suit, this._face, this._value, this._backBitmap] = _delete(args, "suit", "face", "value", "backBitmap", "_args_", "_sealed_");
        super._init(args);
    }
    // onDraw() {
    //     _log("draw");
    //     for(let item of this.getChildren()) {
    //         _log("draw", item);
    //         item.toFront();
    //         item.onDraw();
    //     }
    // }
}