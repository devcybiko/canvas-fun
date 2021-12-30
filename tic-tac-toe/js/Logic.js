class Logic {
    constructor(board, rules) {
        this.board = board;
        this.rules = rules;
    }
    mightWin(who) {
        for (let row of [0, 1, 2]) {
            for (let col of [0, 1, 2]) {
                if (this.board.getCell(row, col) === ".") {
                    this.board.setCell(row, col, who);
                    let win = this.rules.checkWin(who);
                    this.board.setCell(row, col, ".");
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
            let rrr = this.board.getRow(row);
            let col = rrr.indexOf(".");
            if (col > -1 && rrr.includes(who)) {
                console.log(who, rrr);
                return { row, col };
            }
        }
        for (let col of [0, 1, 2]) {
            let ccc = this.board.getCol(col);
            let row = ccc.indexOf(".");
            if (row > -1 && ccc.includes(who)) {
                console.log(who, ccc);
                return { row, col };
            }
        }
        for (let row of [0, 1, 2]) {
            for (let col of [0, 1, 2]) {
                if (this.board.getCell(row, col) === '.') moves.push({ row, col });
            }
        }
        if (moves.length) return moves[_random(0, moves.length)];
        return false;
    }
}
