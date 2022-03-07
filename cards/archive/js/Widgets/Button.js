class Button extends PObject {
    _init(args) {
        this.msg("Button")
        args = Mixin.getArgs(arguments, { name: "", text: "", x: 0, y: 0, w: 0, h: 0, selected: false });
        [this._text] = _delete(args, "text", "_args_", "_sealed_");
        super._init(args);
        this._debug = false;
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
        this.msg("CLICK!", this._name);
    }
}
// Mixin.mixin(Button, { GraphicsMixin, LoggingMixin });
