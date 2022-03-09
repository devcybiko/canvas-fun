class Point {
    constructor(x, y, parent = { x: 0, y: 0, X: 0, Y: 0 }) {
        let p = this._ = {};
        p.parent = parent;
        p.x = x;
        p.y = y;
    }
    get x() { return this._.x; }
    get y() { return this._.y; }
    get X() { return this._.parent.X + this._.x; }
    get Y() { return this._.parent.Y + this._.y; }
}

class Rect {
    static xyxy(x0, y0, x1, y1, p0, p1) {
        let point0 = new Point(x0, y0, p0);
        let point1 = new Point(x1, y1, p1);
        return new Rect(point0, point1);
    }
    constructor(p0, p1) {
        let p = this._ = {};
        p.p0 = p0;
        p.p1 = p1;
    }
    get x0() { return this._.p0.x + this._.mx * this.w; }
    get y0() { return this._.p0.y + this._.mh * this.h; }
    get x1() { return this._.p1.x + this._.mw * this.w; }
    get y1() { return this._.p1.y + this._.mh * this.h; }
    get X0() { return this._.p0.X + this._.mw * this.W; }
    get Y0() { return this._.p0.Y + this._.mh * this.H; }
    get X1() { return this._.p1.X + this._.mw * this.W; }
    get Y1() { return this._.p1.Y + this._.mh * this.H; }
    get w() { return this._.p1.x - this._.p0.x; }
    get h() { return this._.p1.y - this._.p0.y; }
    get W() { return this._.p1.X - this._.p0.X; }
    get H() { return this._.p1.Y - this._.p0.Y; }
}

function test0a() {
    let name = "test0a";
    let a = Rect.xyxy(1, 1, 1, 1);
    if (a.w != 0) console.log(name, "a.w error", a.w);
    if (a.h != 0) console.log(name, "a.h error", a.h);
    if (a.W != 0) console.log(name, "a.W error", a.W);
    if (a.H != 0) console.log(name, "a.H error", a.H);
}
function test0b() {
    let name = "test0b";
    let a = Rect.xyxy(0, 0, 1, 1);
    // console.log(name, "a.x0", a.x0)
    // console.log(name, "a.y0", a.y0)
    // console.log(name, "a.x1", a.x1)
    // console.log(name, "a.y1", a.y1)
    // console.log(name, "a.X0", a.X0)
    // console.log(name, "a.Y0", a.Y0)
    // console.log(name, "a.X1", a.X1)
    // console.log(name, "a.Y1", a.Y1)
    if (a.w != 1) console.log(name, "a.w error", a.w);
    if (a.h != 1) console.log(name, "a.h error", a.h);
    if (a.W != 1) console.log(name, "a.W error", a.W);
    if (a.H != 1) console.log(name, "a.H error", a.H);
}
function test0c() {
    let name = "test0c";
    let a = Rect.xyxy(0, 0, 1920, 760);
    if (a.w != 1920) console.log(name, "width error", a.w);
    if (a.h != 760) console.log(name, "height error", a.h);
}
function test1() {
    let name = "test1";
    let a = Rect.xyxy(20, 30, 24, 49);
    if (a.w != 4) console.log(name, "width error", a.w);
    if (a.h != 19) console.log(name, "height error", a.h);
}
function test2() {
    let a = Rect.xyxy(33, 100, 60, 125);
    if (a.w != 27) console.log("test2", "width error", a.w);
    if (a.h != 25) console.log("test2", "height error", a.h);
}
function test3a() {
    let name = "test3a";
    let p0 = new Point(33, 50);
    let p1 = new Point(25, 35);
    if (p0.x !== 33) console.log(name, "p0.x error", p0.x);
    if (p0.y !== 50) console.log(name, "p0.y error", p0.y);
    if (p0.X !== 33) console.log(name, "p0.X error", p0.X);
    if (p0.Y !== 50) console.log(name, "p0.Y error", p0.Y);
    if (p1.x !== 25) console.log(name, "p1.x error", p1.x);
    if (p1.y !== 35) console.log(name, "p1.y error", p1.y);
    if (p1.X !== 25) console.log(name, "p1.X error", p1.X);
    if (p1.Y !== 35) console.log(name, "p1.Y error", p1.Y);
}
function test3b() {
    let name = "test3b";
    let p0 = new Point(33, 50);
    let p1 = new Point(25, 35, p0);
    if (p0.x !== 33) console.log(name, "p0.x error", p0.x);
    if (p0.y !== 50) console.log(name, "p0.y error", p0.y);
    if (p0.X !== 33) console.log(name, "p0.X error", p0.X);
    if (p0.Y !== 50) console.log(name, "p0.Y error", p0.Y);
    if (p1.x !== 25) console.log(name, "p1.x error", p1.x);
    if (p1.y !== 35) console.log(name, "p1.y error", p1.y);
    if (p1.X !== 58) console.log(name, "p1.X error", p1.X);
    if (p1.Y !== 85) console.log(name, "p1.Y error", p1.Y);
}
function test4a() {
    let name = "test4a";
    let p0 = new Point(25, 35);
    let p1 = new Point(35, 50);
    let r0 = new Rect(p0, p1);

    if (r0.x0 !== 25) console.log(name, "r0.x0 error", r0.x0);
    if (r0.y0 !== 35) console.log(name, "r0.y0 error", r0.y0);
    if (r0.X0 !== 25) console.log(name, "r0.X0 error", r0.X0);
    if (r0.Y0 !== 35) console.log(name, "r0.Y0 error", r0.Y0);
    if (r0.x1 !== 35) console.log(name, "r0.x1 error", r0.x1);
    if (r0.y1 !== 50) console.log(name, "r0.y1 error", r0.y1);
    if (r0.X1 !== 35) console.log(name, "r0.X1 error", r0.X1);
    if (r0.Y1 !== 50) console.log(name, "r0.Y1 error", r0.Y1);
    if (r0.w !== 10) console.log(name, "r0.w error", r0.w);
    if (r0.h !== 15) console.log(name, "r0.h error", r0.h);
    if (r0.W !== 10) console.log(name, "r0.W error", r0.W);
    if (r0.H !== 15) console.log(name, "r0.H error", r0.H);
}
function test4b() {
    let name = "test4b";
    let p0 = new Point(25, 35);
    let p1 = new Point(33, 50, p0);
    let r0 = new Rect(p0, p1);

    if (r0.x0 !== 25) console.log(name, "r0.x0 error", r0.x0);
    if (r0.y0 !== 35) console.log(name, "r0.y0 error", r0.y0);
    if (r0.X0 !== 25) console.log(name, "r0.X0 error", r0.X0);
    if (r0.Y0 !== 35) console.log(name, "r0.Y0 error", r0.Y0);
    if (r0.x1 !== 33) console.log(name, "r0.x1 error", r0.x1);
    if (r0.y1 !== 50) console.log(name, "r0.y1 error", r0.y1);
    if (r0.X1 !== 58) console.log(name, "r0.X1 error", r0.X1);
    if (r0.Y1 !== 85) console.log(name, "r0.Y1 error", r0.Y1);
    if (r0.w !== 8) console.log(name, "r0.w error", r0.w);
    if (r0.h !== 15) console.log(name, "r0.h error", r0.h);
    if (r0.W !== 33) console.log(name, "r0.W error", r0.W);
    if (r0.H !== 50) console.log(name, "r0.H error", r0.H);
}
function test4c() {
    let name = "test4c";
    let p0 = new Point(25, 35);
    let p1 = new Point(0, 0, p0);
    let r0 = new Rect(p0, p1);

    if (r0.x0 !== 25) console.log(name, "r0.x0 error", r0.x0);
    if (r0.y0 !== 35) console.log(name, "r0.y0 error", r0.y0);
    if (r0.X0 !== 25) console.log(name, "r0.X0 error", r0.X0);
    if (r0.Y0 !== 35) console.log(name, "r0.Y0 error", r0.Y0);
    if (r0.x1 !== 0) console.log(name, "r0.x1 error", r0.x1);
    if (r0.y1 !== 0) console.log(name, "r0.y1 error", r0.y1);
    if (r0.X1 !== 25) console.log(name, "r0.X1 error", r0.X1);
    if (r0.Y1 !== 35) console.log(name, "r0.Y1 error", r0.Y1);
    if (r0.w !== -25) console.log(name, "r0.w error", r0.w);
    if (r0.h !== -35) console.log(name, "r0.h error", r0.h);
    if (r0.W !== 0) console.log(name, "r0.W error", r0.W);
    if (r0.H !== 0) console.log(name, "r0.H error", r0.H);
}
function test5() {
    let name = "test5";
    let p0 = new Point(0, 0);
    let p1 = new Point(1920, 760, p0);

    let p2 = new Point(25, 33, p0)
    let p3 = new Point(200, 300, p2);

    let p4 = new Point(60, 70, p0);
    let p5 = new Point(90, 100, p3);

    let r0 = new Rect(p0, p1);
    let r1 = new Rect(p2, p3);
    let r2 = new Rect(p4, p5);

    if (r0.X0 !== 0) console.log(name, "r0.X0 error", r0.X0);
    if (r0.Y0 !== 0) console.log(name, "r0.Y0 error", r0.Y0);
    if (r0.X1 !== 1920) console.log(name, "r0.X1 error", r0.X1);
    if (r0.Y1 !== 760) console.log(name, "r0.Y1 error", r0.Y1);
    if (r0.W !== 1920) console.log(name, "r0.W error", r0.W);
    if (r0.H !== 760) console.log(name, "r0.H error", r0.H);

    if (r1.X0 !== 25) console.log(name, "r1.X0 error", r1.X0);
    if (r1.Y0 !== 33) console.log(name, "r1.Y0 error", r1.Y0);
    if (r1.X1 !== 225) console.log(name, "r1.X1 error", r1.X1);
    if (r1.Y1 !== 333) console.log(name, "r1.Y1 error", r1.Y1);
    if (r1.W !== 200) console.log(name, "r1.W error", r1.W);
    if (r1.H !== 300) console.log(name, "r1.H error", r1.H);

    if (r2.X0 !== 60) console.log(name, "r2.X0 error", r2.X0);
    if (r2.Y0 !== 70) console.log(name, "r2.Y0 error", r2.Y0);
    if (r2.X1 !== 315) console.log(name, "r2.X1 error", r2.X1);
    if (r2.Y1 !== 433) console.log(name, "r2.Y1 error", r2.Y1);
    if (r2.W !== 255) console.log(name, "r2.W error", r2.W);
    if (r2.H !== 363) console.log(name, "r2.H error", r2.H);
}
function test6() {
    let name = "test5";
    let p0 = new Point(0, 0);
    let p1 = new Point(1920, 760, p0);

    let r0 = new Rect(p0, p1, 0.75);

    if (r0.X0 !== 0) console.log(name, "r0.X0 error", r0.X0);
    if (r0.Y0 !== 0) console.log(name, "r0.Y0 error", r0.Y0);
    if (r0.X1 !== 1920) console.log(name, "r0.X1 error", r0.X1);
    if (r0.Y1 !== 760) console.log(name, "r0.Y1 error", r0.Y1);
    if (r0.W !== 1920) console.log(name, "r0.W error", r0.W);
    if (r0.H !== 760) console.log(name, "r0.H error", r0.H);
}
function main() {
    test0a();
    test0b();
    test0c();
    test1();
    test2();
    test3a();
    test3b();
    test4a();
    test4b();
    test4c();
    test5();
    test6();
}

main()