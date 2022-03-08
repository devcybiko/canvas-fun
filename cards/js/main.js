let canvasBM = PCanvasBitMap.factory({canvasId: "my_canvas"});
// canvas.line(canvas.x, canvas.y, canvas.w, canvas.h);

let rootObject = Playfield.factory({name: "root", bitmap: canvasBM});
let screen = PObject.factory({name: "window", parent: rootObject, relrect: PRelRect.xywh(0, 0, 1.0, 1.0)});
let menu = PObject.factory({name: "menu", parent: screen, relrect: PRelRect.xywh(0, 0, 1.0, 25)});
let button1 = PObject.factory({name: "button1", parent: menu, relrect: PRelRect.xywh(1.01, 1.01, 0.25, 25)});
let button2 = PObject.factory({name: "button2", parent: menu, relrect: PRelRect.xywh(0.25, 0.00, 0.25, 25)});
let button3 = PObject.factory({name: "button3", parent: menu, relrect: PRelRect.xywh(0.50, 0.00, 0.25, 25)});
let button4 = PObject.factory({name: "button4", parent: menu, relrect: PRelRect.xywh(0.75, 0.00, 0.25, 25)});
let left = PObject.factory({name: "left", parent: screen, relrect: PRelRect.xyxy(0.00, 25, 0.25, 1.0)});
let body = PObject.factory({name: "body", parent: screen, relrect: PRelRect.xyxy(0.25, 25, 1.00, 1.0)});

rootObject.draw();

let w = 10;
let h = 10;

let id = setInterval(() => {
    if (w + 10 > 512) {
        clearInterval(id);
        return;
    }
    w += 10;
    h += 10;
    menu.resize(w, h);
    rootObject.draw();
    console.log(h);
}, 100)

