class Box extends Shape {
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