const Drawer = {
    Drawer(obj) {
        obj.foo = "FOO";
    },
    box(ctx, color, x, y, w, h) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    },
    border(ctx, color, x, y, w, h) {
        ctx.strokeStyle = color;
        ctx.strokeRect(x, y, w, h);
    },
    borderBox(ctx, borderColor, fillColor, x, y, w, h) {
        this.box(ctx, fillColor, x, y, w, h);
        this.border(ctx, borderColor, x, y, w, h);
    },
    line(ctx, color, x0, y0, x1, y1) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    },
    circle(ctx, color, x, y, r) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.ellipse(x + r, y + r, r, r, 0, 0, 2 * Math.PI);
        ctx.stroke();
    },
    text(ctx, msg, color, x, y, w, h) {
        ctx.font = '12px sans-serif';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(msg, x + w / 2, y + h / 2);
    },
    borderText(ctx, msg, borderColor, fillColor, textColor, x, y, w, h) {
        this.borderBox(ctx, borderColor, fillColor, x, y, w, h);
        this.text(ctx, msg, textColor, x, y, w, h);
    }
}

const Logger = {
    Logger(obj) {
        obj.foo = "BAR";
    },
    log(msg) {
        console.log("Logger::log", this.foo, msg);
    }
}
class Grid extends PObject {
    static {
        this.mixin({Drawer});
        this.mixin({Logger});
    }
    static HUMAN = 0;
    static COMPUTER = 1;

    constructor(name) {
        super(name, "white", 0, 0, 250, 250);
        this.W = Math.floor(this.w / 3);
        this.H = Math.floor(this.h / 3);
        this.turn = Grid.HUMAN;
        this.lastRow = false;
        this.lastCol = false;
        this._initialize(this);
    }
    draw(ctx) {
        this.line(ctx, "black", this.W, 0, this.W, this.h);
        this.line(ctx, "black", this.W * 2, 0, this.W * 2, this.h);
        this.line(ctx, "black", 0, this.H, this.w, this.H);
        this.line(ctx, "black", 0, this.H * 2, this.w, this.H * 2);
    }
    click(x, y) {
        if (this.turn != Grid.HUMAN) return true;
        let row = Math.floor(y / this.H);
        let col = Math.floor(x / this.W);
        if (row >= 3) return;
        if (col >= 3) return;
        this.lastRow = row;
        this.lastCol = col;
    }
}

class Piece extends PObject {
    static {
        this.mixin({Drawer});
        this.mixin({Logger});
    }
    constructor(grid, row, col) {
        super("", "black", 0, 0, grid.H, grid.W);
        this.move(row, col);
        this._initialize();
    }
    move(row, col) {
        this.y = row * this.h;
        this.x = col * this.w;
        this.row = row;
        this.col = col;
    }
}

class X extends Piece {
    constructor(grid, row, col) {
        super(grid, row, col);
    }
    draw(ctx) {
        this.line(ctx, "black", this.x, this.y, this.x + this.w, this.y + this.h);
        this.line(ctx, "black", this.x + this.w, this.y, this.x, this.y + this.h);
    }
}

class O extends Piece {
    constructor(grid, row, col) {
        super(grid, row, col);
    }
    draw(ctx) {
        this.circle(ctx, "black", this.x, this.y, this.w / 2);
    }
}

class Message extends PObject {
    static {
        this.mixin({Drawer});
        this.mixin({Logger});
    }
    constructor(grid) {
        super("", "black", grid.w/4, grid.h/2 - 12, grid.w/2, 24);
        this.msg = null;
        this._initialize();
    }
    show(msg, timeout) {
        this.msg = msg;
        this.playfield.toFront(this);
        this.timeout = 0;
        if (timeout) {
            let now = new Date().getTime();
            this.timeout = now + timeout;
        }
    }
    hide() {
        this.msg = null;
        this.playfield.toBack(this);
    }
    click(x,y) {
        this.hide();
    }
    draw(ctx) {
        let now = new Date().getTime();
        if (this.timeout && this.timeout < now) this.msg = null;
        if (this.msg) {
            this.log("objects:154", "Message:" + this.msg);
            this.borderText(ctx, this.msg, "black", "white", "black", this.x, this.y, this.w, this.h);
        }
    }
}

class TicTacToe extends PObject {
    static XXX = "X";
    static OOO = "O";
    constructor(grid, msg) {
        super(name, "white", 0, 0, 250, 250);
        this.grid = grid;
        this.msg = msg;
        this.cnt = 0;
        this.board = [["","",""],["","",""],["","",""]];
    }
    getNextMove() {
        let options = [];
        for(let row=0; row<3; row++) {
            for(let col=0; col<3; col++) {
                if (!this.board[row][col]) options.push({row,col});
            }
        }
        if (options.length) {
            let choice = random(0, options.length);
            return options[choice];
        }
    }
    computerMove() {
        this.msg.show("THINKING...");
        this.cnt++;
        if (this.cnt < 10) return;
        this.cnt = 0;
        this.msg.hide();

        let move = this.getNextMove();
        if (!move) {
            this.msg.show("I have no moves");
            this.grid.turn = Grid.HUMAN;
            return;
        }

        let ooo = new O(this.grid, move.row, move.col);
        this.playfield.add(ooo);
        ooo.toFront();
        this.board[move.row][move.col] = TicTacToe.OOO;
        this.playfield.redraw();
        this.grid.turn = Grid.HUMAN;
    }
    humanMove() {
        let row = this.grid.lastRow;
        let col = this.grid.lastCol;
        if (row === false) return; // human still thinking
        
        let cell = this.board[row][col];
        if (cell) {
            this.msg.show("Bad Move, try again...", 2000);
            this.grid.lastRow = false;
            this.playfield.redraw();
            return;
        }

        let xxx = new X(this.grid, row, col);
        this.playfield.add(xxx);
        xxx.toFront();
        this.playfield.redraw();

        this.board[row][col] = TicTacToe.XXX;
        this.grid.lastRow = false;
        this.grid.turn = Grid.COMPUTER;
    }
    _getCol(col) {
        return this.board[0][col]+this.board[1][col]+this.board[2][col];
    }
    _getRow(row) {
        return this.board[row][0]+this.board[row][1]+this.board[row][2];
    }
    _getDiag1() {
        return this.board[0][0]+this.board[1][1]+this.board[2][2];
    }
    _getDiag2() {
        return this.board[2][0]+this.board[1][1]+this.board[0][2];
    }
    
    checkWin(who) {
        for(let i of [0,1,2]) {
            if (this._getRow(i) === who) return true;
            if (this._getCol(i) === who) return true;
        }
        if (this._getDiag1() === who) return true;
        if (this._getDiag2() === who) return true;
        return false;
    }
    checkCat() {
        return !this.getNextMove();
    }
    go() {
        this.toBack();
        if (this.checkWin("XXX")) {
            this.msg.show("X WINS!")
            return;
        }
        if (this.checkWin("OOO")) {
            this.msg.show("O WINS!");
            return;
        }
        if (this.checkCat()) {
            this.msg.show("ITS THE CATS GAME!");
            return;
        }
        if (this.grid.turn === Grid.COMPUTER) {
            this.computerMove();
        } else {
            this.humanMove();
        }
    }
}