class Anchor {
    constructor(m, b, parent, mkey, bkey) {
        this.m = m;
        this.b = b;
        this.parent = parent;
        this.mkey = mkey;
        this.bkey = bkey;
    }
    get n() {return this.b + this.parent[this.bkey] + this.m * this.parent[this.mkey]};
    get N() {return this._.parent[this._.key] + this._.n;}
}

class Rect {
    constructor(x0, y0, x1, y1) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
        this.recompute();
    }
    recompute() {
        this.w = this.x1 - this.x0;
        this.h = this.y1 - this.y0;
    }
}

function main() {
    let a = {};
    let r = new Rect(12, 12, 512, 512);
    a.x0 = new Anchor(0.25, 0, r, "w", "x0");
    a.y0 = new Anchor(0, 0, r, "h", "y0");
    a.x1 = new Anchor(0.75, 0, r, "w", "x1");
    a.y1 = new Anchor(0, 25, r, "h", "y1");
    console.log("n", a.x0.n, a.y0.n, a.x1.n, a.y1.n);
    r.x1 = 1024;
    r.y1 = 1024;
    r.recompute();
    console.log("n", a.x0.n, a.y0.n, a.x1.n, a.y1.n);
}

main();