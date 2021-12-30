class Logic {
    constructor(board) {
        this.board = board;
    }
    mightWin(who) {
        for (let row of [0, 1, 2]) {
            for (let col of [0, 1, 2]) {
                if (this.board[row][col] === ".") {
                    this.board[row][col] = who;
                    let win = this.checkWin(who.repeat(3));
                    this.board[row][col] = ".";
                    if (win) return { row, col };
                }
            }
        }
        return false;
    }
    getNextMove(who, other) {
        let moves = [];
        let canWin = this.mightWin(who, other);
        if (canWin) return canWin;
        canWin = this.mightWin(other, who);
        if (canWin) return canWin;
        for (let row of [0, 1, 2]) {
            let rrr = this._getRow(row);
            let col = rrr.indexOf(".");
            if (col > -1 && rrr.includes(who)) {
                console.log(who, rrr);
                return { row, col };
            }
        }
        for (let col of [0, 1, 2]) {
            let ccc = this._getCol(col);
            let row = ccc.indexOf(".");
            if (row > -1 && ccc.includes(who)) {
                console.log(who, ccc);
                return { row, col };
            }
        }
        for (let row of [0, 1, 2]) {
            for (let col of [0, 1, 2]) {
                if (this.board[row][col] === '.') moves.push({ row, col });
            }
        }
        if (moves.length) return moves[random(0, moves.length)];
        return false;
    }
    computerMove() {
        this.msg.show("THINKING..");
        this.cnt++;
        if (this.cnt < 10) return;
        this.cnt = 0;
        this.msg.hide();

        let move = this.getNextMove("O", "X");
        if (!move) {
            this.msg.show("I have no moves");
            this.board.turn = Board.HUMAN;
            return;
        }

        let ooo = new O(this.board, move.row, move.col);
        this.playfield.add(ooo);
        ooo.toFront();
        this.board[move.row][move.col] = TicTacToe.OOO;
        this.playfield.redraw();
        this.board.turn = Board.HUMAN;
    }
    humanMove() {
        let row = this.board.lastRow;
        let col = this.board.lastCol;
        if (row === false) return; // human still thinking

        let cell = this.board.getCell(row, col);;
        if (cell != '.') {
            this.msg.show("Bad Move, try again..", 2000);
            this.board.lastRow = false;
            this.playfield.redraw();
            return;
        }

        let xxx = new X(this.board, row, col);
        this.playfield.add(xxx);
        xxx.toFront();
        this.playfield.redraw();

        this.board[row][col] = TicTacToe.XXX;
        this.board.lastRow = false;
        this.board.turn = Board.COMPUTER;
    }
}
