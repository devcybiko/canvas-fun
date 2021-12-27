
const playfield = new Playfield('#my_canvas');
let grid = new Grid("Grid");
let msg = new Message(grid);
let ttt = new TicTacToe(grid, msg);
playfield.add(grid);
playfield.add(msg);
playfield.add(ttt);

msg.show("TIC TAC TOE!", 3000);

playfield.start(128);