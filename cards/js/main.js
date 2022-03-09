let canvasBM = PCanvasBitMap.factory({canvasId: "my_canvas"});
let playfield = Playfield.factory({name: "playfield", bitmap: canvasBM});
// let screen = PObject.factory({name: "screen", parent: playfield, relrect: PRelRect.xywh(0, 0, 1.0, 1.0)});
let menu = PObject.factory({name: "menu", parent: playfield, relrect: PRelRect.xyxy(10, 0, 0.95, 25)});
let button1 = PButtonGroup.factory({name: "button1", parent: menu, relrect: PRelRect.xywh(0, 1.01, 0.25, 25), groupName: "menu"});
let button2 = PButtonGroup.factory({name: "button2", parent: menu, relrect: PRelRect.xywh(0.25, 0.00, 0.25, 25), groupName: "menu"});
let button3 = PButtonGroup.factory({name: "button3", parent: menu, relrect: PRelRect.xywh(0.50, 0.00, 0.25, 25), groupName: "menu"});
let button4 = PButtonGroup.factory({name: "button4", parent: menu, relrect: PRelRect.xywh(0.75, 0.00, 0.25, 25), groupName: "menu"});
let left = PObject.factory({name: "left", parent: playfield, relrect: PRelRect.xyxy(10, 25, 0.25, 0.95)});
let body = PObject.factory({name: "body", parent: playfield, relrect: PRelRect.xyxy(0.25, 25, 0.95, 0.95)});
let message0 = PButton.factory({name: "message0", parent: body, relrect: PRelRect.xywh(0.25, 0.5, 0.5, 0.5, 0, 0)});
let message1 = PButton.factory({name: "message1", parent: body, relrect: PRelRect.xywh(0.25, 0.5, 0.5, 50, -50, 25)});
let message2 = PButton.factory({name: "message2", parent: body, relrect: PRelRect.xywh(0.25, 0.5, 0.5, 25, 60, 10)});
let message3 = PButton.factory({name: "message3", parent: body, relrect: PRelRect.xywh(0.25, 0.5, 0.5, 25, -50, -25)});
let message4 = PButton.factory({name: "message4", parent: body, relrect: PRelRect.xywh(0.25, 0.5, 0.5, 25, 50, 25)});

let canvasES = PCanvasEventStream.factory({canvasId: "my_canvas"});
canvasES.add(playfield);

playfield.draw();

// let x = 0.0;
// let y = 0.0;

// let id = setInterval(() => {
//     if (x + 0.05 > 1.0) {
//         clearInterval(id);
//         return;
//     }
//     x += 0.05;
//     y += 0.05;
//     body.move(x, y);
//     playfield.draw();
// }, 100)

