var PRect = require("../js/PRect.js");
var PRelRect = require("../js/PRelRect.js");
const assert = require("./assert.js");

let _tests = {
    testRelRect() {
        let relrect = PRelRect.xyxy(25, 50, .75, .75)
        assert.equals(relrect._.mx0, 0)
        assert.equals(relrect._.my0, 0)
        assert.equals(relrect._.bx0, 25)
        assert.equals(relrect._.by0, 50)
        assert.equals(relrect._.mx1, 0.75)
        assert.equals(relrect._.my1, 0.75)
        assert.equals(relrect._.bx1, 0)
        assert.equals(relrect._.by1, 0)
        assert.equals(relrect._.mw, 0)
        assert.equals(relrect._.bw, 0)
        assert.equals(relrect._.mh, 0)
        assert.equals(relrect._.bh, 0)
    },
    testScale() {
        let xyxy = PRect.xyxy(0, 0, 100, 100);
        let relrect = PRelRect.xyxy(25, 50, .75, .75)
        let newxyxy = relrect.scale(xyxy);
        assert.equals(newxyxy.x0, 25)
        assert.equals(newxyxy.y0, 50)
        assert.equals(newxyxy.x1, 75)
        assert.equals(newxyxy.y1, 75)
        assert.equals(newxyxy.w, 50)
        assert.equals(newxyxy.h, 25)
    },
    testScaleFixedPoint() {
        let xyxy = PRect.xyxy(0, 0, 100, 100);
        let relrect = PRelRect.xyxy(25, 50, 50, 75)
        let newxyxy = relrect.scale(xyxy);
        assert.equals(newxyxy.x0, 25)
        assert.equals(newxyxy.y0, 50)
        assert.equals(newxyxy.x1, 50)
        assert.equals(newxyxy.y1, 75)
        assert.equals(newxyxy.w, 25)
        assert.equals(newxyxy.h, 25)
    },
    testScaleFractions() {
        let xyxy = PRect.xyxy(0, 0, 100, 100);
        let relrect = PRelRect.xyxy(.5, .5, .75, .75)
        let newxyxy = relrect.scale(xyxy);
        assert.equals(newxyxy.x0, 50)
        assert.equals(newxyxy.y0, 50)
        assert.equals(newxyxy.x1, 75)
        assert.equals(newxyxy.y1, 75)
        assert.equals(newxyxy.w, 25)
        assert.equals(newxyxy.h, 25)
    },
    testScaleMixedUp() {
        let xyxy = PRect.xyxy(0, 0, 100, 100);
        let relrect = PRelRect.xyxy(25, 50, .333, .333)
        let newxyxy = relrect.scale(xyxy);
        assert.equals(newxyxy.x0, 25)
        assert.equals(newxyxy.y0, 33)
        assert.equals(newxyxy.x1, 33)
        assert.equals(newxyxy.y1, 50)
        assert.equals(newxyxy.w, 8)
        assert.equals(newxyxy.h, 17)
    },
    testScaleWidthHeight() {
        let xyxy = PRect.xyxy(0, 0, 100, 100);
        let relrect = PRelRect.xywh(25, 50, .333, .333)
        let newxyxy = relrect.scale(xyxy);
        assert.equals(newxyxy.x0, 25)
        assert.equals(newxyxy.y0, 50)
        assert.equals(newxyxy.x1, 58)
        assert.equals(newxyxy.y1, 83)
        assert.equals(newxyxy.w, 33)
        assert.equals(newxyxy.h, 33)
    },
}

module.exports = _tests;