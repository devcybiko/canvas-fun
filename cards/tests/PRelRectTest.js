var PRect = require("../js/PRect.js");
var PRelRect = require("../js/PRelRect.js");
const assert = require("./assert.js");

let _tests = {
    testRelRect() {
        let relrect = new PRelRect(25, 50, .75, .75)
        assert.equals(relrect._.float[0], 0)
        assert.equals(relrect._.float[1], 0)
        assert.equals(relrect._.float[2], 0.75)
        assert.equals(relrect._.float[3], 0.75)
        assert.equals(relrect._.delta[0], 25)
        assert.equals(relrect._.delta[1], 50)
        assert.equals(relrect._.delta[2], 0)
        assert.equals(relrect._.delta[3], 0)
    },
    testScale() {
        let xyxy = PRect.xyxy(0, 0, 100, 100);
        let relrect = new PRelRect(25, 50, .75, .75)
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
        let relrect = new PRelRect(25, 50, 50, 75)
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
        let relrect = new PRelRect(.5, .5, .75, .75)
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
        let relrect = new PRelRect(25, 50, .333, .333)
        let newxyxy = relrect.scale(xyxy);
        assert.equals(newxyxy.x0, 25)
        assert.equals(newxyxy.y0, 33)
        assert.equals(newxyxy.x1, 33)
        assert.equals(newxyxy.y1, 50)
        assert.equals(newxyxy.w, 8)
        assert.equals(newxyxy.h, 17)
    },
}

module.exports = _tests;