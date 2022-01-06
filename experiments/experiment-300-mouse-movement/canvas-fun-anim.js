const canvas = document.querySelector('#my_canvas');
document.addEventListener("keydown", handleKeyEvent);
document.addEventListener('mousemove', handleMouseEvent);

const ctx = canvas.getContext('2d');

let color = "red";
let x = 0;
let y = 0;


let trail = 8;
let old = [];

redraw();
function redraw() {
    old.push({x,y});
    if (old.length > trail) old = old.slice(-trail)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let frac = 1/old.length;
    let i = 1;
    for(let posn of old) {
        let opaque = frac * i;
        console.log(opaque);
        ctx.globalAlpha = opaque;
        ctx.fillStyle = color;
        ctx.strokeStyle = 'black';
        ctx.fillRect(posn.x, posn.y, 100, 100);
        if (i === old.length) ctx.strokeRect(posn.x, posn.y, 100, 100);
        i++;   
    }
}

function handleKeyEvent(event) {
    console.log(event.key);
    if (event.key === 'r') color = 'red';
    if (event.key === 'o') color = 'orange';
    if (event.key === 'y') color = 'yellow';
    if (event.key === 'g') color = 'green';
    if (event.key === 'b') color = 'blue';
    if (event.key === 'i') color = 'indigo';
    if (event.key === 'v') color = 'violet';
    if (event.key === 'ArrowUp') y += -10;
    if (event.key === 'ArrowDown') y += 10;
    if (event.key === 'ArrowLeft') x += -10;
    if (event.key === 'ArrowRight') x += 10;
    redraw();
}

function handleMouseEvent(event) {
    console.log({event});
    x = event.offsetX - 50;
    y = event.offsetY - 50;
    redraw();
}

