const PRect = require("../js/PRect.js");
const assert = require("./assert.js");

let _tests = {
    testXYWH() {
        let xywh = PRect.xywh(100, 200, 50, 75);
        assert.equals(xywh.x, 100)
        assert.equals(xywh.y, 200)
        assert.equals(xywh.x0, 100)
        assert.equals(xywh.y0, 200)
        assert.equals(xywh.x1, 150)
        assert.equals(xywh.y1, 275)
        assert.equals(xywh.w, 50)
        assert.equals(xywh.h, 75)
    },
    testXYXY() {
        let xyxy = PRect.xyxy(100, 200, 150, 275);
        assert.equals(xyxy.x, 100)
        assert.equals(xyxy.y, 200)
        assert.equals(xyxy.x0, 100)
        assert.equals(xyxy.y0, 200)
        assert.equals(xyxy.x1, 150)
        assert.equals(xyxy.y1, 275)
        assert.equals(xyxy.w, 50)
        assert.equals(xyxy.h, 75)
    },
    testXYWH_negative() {
        let xywh = PRect.xywh(100, 200, -50, -75);
        assert.equals(xywh.x, 50)
        assert.equals(xywh.y, 125)
        assert.equals(xywh.x0, 50)
        assert.equals(xywh.y0, 125)
        assert.equals(xywh.x1, 100)
        assert.equals(xywh.y1, 200)
        assert.equals(xywh.w, 50)
        assert.equals(xywh.h, 75)
    },
    testXYXY_negative() {
        let xyxy = PRect.xyxy(150, 275, 100, 200);
        assert.equals(xyxy.x, 100)
        assert.equals(xyxy.y, 200)
        assert.equals(xyxy.x0, 100)
        assert.equals(xyxy.y0, 200)
        assert.equals(xyxy.x1, 150)
        assert.equals(xyxy.y1, 275)
        assert.equals(xyxy.w, 50)
        assert.equals(xyxy.h, 75)
    },
    testXYXY_negative2() {
        let xyxy = PRect.xyxy(25, 100, 100, 0);
        assert.equals(xyxy.x, 25)
        assert.equals(xyxy.y, 0)
        assert.equals(xyxy.x0, 25)
        assert.equals(xyxy.y0, 0)
        assert.equals(xyxy.x1, 100)
        assert.equals(xyxy.y1, 100)
        assert.equals(xyxy.w, 75)
        assert.equals(xyxy.h, 100)
    }
}

module.exports = _tests;