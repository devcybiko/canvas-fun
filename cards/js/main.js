let xywh = PRect.xywh(100, 200, 50, 75);
console.log(xywh);
let relrect = new PRelRect(25, 50, .75, .75)
console.log(relrect);

let canvas = document.querySelector("#my_canvas");
if (!canvas) throw Error(`Could not find Canvas in DOM`);
let ctx = canvas.getContext('2d');

function rect(prect, fill="red", stroke="black") {
    ctx.fillStyle = fill;
    ctx.fillRect(prect.x, prect.y, prect.w, prect.h);
    ctx.strokeStyle = stroke;
    ctx.strokeRect(prect.x, prect.y, prect.w, prect.h);
}

let xxx = 0;
function redraw(incr) {
    if (xxx > canvas.height) return;
    let parent1 = PRect.xyxy(0, 0, xxx, xxx);

    let ref = PRect.xywh(0, 0, canvas.width, canvas.height);
    rect(ref, "white", "black");
        
    let prect1 = new PRelRect(0, 0, 0, 0, 1.0, 25);
    let rect1 = prect1.scale(parent1)
    rect(rect1, "blue");
    console.log("blue", rect1._);
    
    let prect2 = new PRelRect(0, 25, 0, 0, 0.5, 1.0 );
    prect2._.delta[5] = -25;
    let rect2 = prect2.scale(parent1)
    rect(rect2, "red");
    console.log("red", rect2._);
    
    let prect3 = new PRelRect(0.5, 25, 1.0, 1.0 );
    let rect3 = prect3.scale(parent1)
    rect(rect3, "yellow");
    console.log("yellow", rect3._);
    

    let prect5 = new PRelRect(0.25, 0.25, 0.75, 0.75, 0, 0 );
    // prect5._.delta[1] = -25;
    let rect5 = prect5.scale(parent1)
    rect(rect5, "indigo");
    console.log("indigo", rect5._);

    let prect4 = new PRelRect(0.25, 0.50, 0, 0, 0.5, 50 );
    prect4._.delta[1] = -25;
    let rect4 = prect4.scale(parent1)
    rect(rect4, "gray");
    console.log("gray", rect4._);


    xxx += incr;
    setTimeout(redraw, 100, 10);
}

redraw(10);

