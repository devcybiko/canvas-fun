const canvas = document.querySelector('#my_canvas');
document.addEventListener("keydown", handleKeyDown);
const ctx = canvas.getContext('2d');

let color = "violet";
let x = 0;
let y = 0;


let old = [];
handleKeyDown({});
function handleKeyDown(event) {
    console.log(event.key);
    if (event.key === 'r') color = 'red';
    if (event.key === 'o') color = 'orange';
    if (event.key === 'y') color = 'yellow';
    if (event.key === 'g') color = 'green';
    if (event.key === 'b') color = 'blue';
    if (event.key === 'i') color = 'indigo';
    if (event.key === 'v') color = 'violet';
    if (event.key === 'ArrowUp') y += -20;
    if (event.key === 'ArrowDown') y += 20;
    if (event.key === 'ArrowLeft') x += -20;
    if (event.key === 'ArrowRight') x += 20;
    
    old.push({x,y});
    let trail = 8;
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
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

