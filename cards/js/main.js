let playfield = Playfield.factory({name: "playfield", canvasId: "my_canvas"});
// let screen = PObject.factory({name: "screen", parent: playfield, relrect: PRelRect.xywh(0, 0, 1.0, 1.0)});
let menu = PGroupButton.factory({name: "menu", parent: playfield, relrect: PRelRect.xyxy(0, 0, 1.0, 25)});
let button1 = PButtonSelect.factory({name: "button1", parent: menu, relrect: PRelRect.xywh(0, 0, 0.25, 25), groupName: "menu"});
let button2 = PButtonSelect.factory({name: "button2", parent: menu, relrect: PRelRect.xywh(0.25, 0.00, 0.25, 25), groupName: "menu"});
let button3 = PButtonSelect.factory({name: "button3", parent: menu, relrect: PRelRect.xywh(0.50, 0.00, 0.25, 25), groupName: "menu"});
let button4 = PButtonSelect.factory({name: "button4", parent: menu, relrect: PRelRect.xywh(0.75, 0.00, 0.25, 25), groupName: "menu"});
let left = PGroup.factory({name: "left", parent: playfield, relrect: PRelRect.xyxy(0, 25, 0.25, 1)});
let body = PGroup.factory({name: "body", parent: playfield, relrect: PRelRect.xyxy(0.25, 25, 1, 1)});
let message0 = PButton.factory({name: "message0", parent: body, relrect: PRelRect.xywh(0.25, 0.5, 0.5, 0.5, 0, 0)});
let message1 = PButtonToggle.factory({name: "message1", parent: body, relrect: PRelRect.xywh(0.25, 0.5, 0.5, 50, -50, 25)});
let message2 = PButtonToggle.factory({name: "message2", parent: body, relrect: PRelRect.xywh(0.25, 0.5, 0.5, 25, 60, 10)});
let message3 = PButtonArmed.factory({name: "message3", parent: body, relrect: PRelRect.xywh(0.25, 0.5, 0.5, 25, -50, -25)});
let message4 = PButtonToggle.factory({name: "message4", parent: body, relrect: PRelRect.xywh(0.25, 0.5, 0.5, 25, 50, 25)});

function extend(fnName, obj, replacement) {
    let tmp = obj[fnName];
    obj.orig = tmp.bind(obj);
    obj[fnName] = replacement.bind(obj);
}

extend("fire", message3, function(x, y, event, context, eventType) {
    console.log("MESSAGE ZERO SAYS HELLO!", x, y, this.name);
    return this.orig(...arguments);
});

let canvasEP = PCanvasEventPump.factory({canvasId: "my_canvas"});
canvasEP.add(playfield);

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

