class Circle extends Shape {
    _init(args) {
      super._init(...arguments);
      this.scribble = null;
    }
    onDraw() {
      console.log(this.getRect());
      this.ellipse({ x: this.X, y: this.Y, w: this.W, h: this.H });
      this.text({ text: this._name, x: this.X, y: this.Y, w: this.W, h: this.H, fillColor: "", borderColor: "" });
      if (this._isHovering || this._isDragging) {
        let a2 = ANCHOR_SIZE / 2;
        let a = ANCHOR_SIZE;
        let w2 = Math.floor(this.w / 2);
        let h2 = Math.floor(this.h / 2);
        let cx = this.x + w2;
        let cy = this.y + h2;
        let x0 = ellipseX(135, w2);
        let y0 = ellipseY(135, h2);
  
        // console.log(cx, cy, x0, y0, cx + x0, cy + y0)
        // this.rect({ x: cx + x0 - a2, y: cy + y0 - a2, w: a, h: a });
        // this.rect({ x: cx + x0 - a2, y: cy - y0 - a2, w: a, h: a });
        // this.rect({ x: cx - x0 - a2, y: cy + y0 - a2, w: a, h: a });
        // this.rect({ x: cx - x0 - a2, y: cy - y0 - a2, w: a, h: a });
  
        this.rect({ x: cx - a2, y: this.y - a2, w: a, h: a })
        this.rect({ x: this.x - a2, y: this.y + h2 - a2, w: a, h: a })
        this.rect({ x: this.x + this.w - a2, y: this.y + h2 - a2, w: a, h: a })
        this.rect({ x: cx - a2, y: this.y + this.h - a2, w: a, h: a })
      }
    }
    inBounds(x, y) {
      let cx = Math.floor(this.x + this.w / 2);
      let cy = Math.floor(this.y + this.h / 2);
      let dx = cx - x;
      let dy = cy - y;
      let left = squared(dx) / squared((this.w + 10) / 2);
      let right = squared(dy) / squared((this.h + 10) / 2);
      let sum = left + right;
      let inside = sum < 1;
      return inside;
    }
  
  }
  function squared(a) { return a * a }
  function toRadians(d) { return Math.PI * d / 180; }
  function ellipseX(angle, width) { return Math.floor(Math.cos(toRadians(angle)) * width); }
  function ellipseY(angle, height) { return Math.floor(Math.sin(toRadians(angle)) * height); }