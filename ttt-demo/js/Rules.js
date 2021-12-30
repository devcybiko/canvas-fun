class Rules {
    constructor(board) {
        this._board = board;
    }
    checkMove(row, col, who) {
        if (this._board.getCell(row, col) === Board.EMPTY) return true;
        return false;
    }
    checkWin(who) {
        let win = who.repeat(3);
        for(let cnt in [0,1,2]) {
            if (this._board.getRow(cnt) === win) return true;
            if (this._board.getCol(cnt) === win) return true;
        }
        if (this._board.getDiag1() === win) return true;
        if (this._board.getDiag2() === win) return true;
        return false;
    }
    checkDraw() {
        for(let row in [0,1,2]) {
            for(let col in [0,1,2]) {
                if (this._board.getCell(row, col) === Board.EMPTY) return false;
            }
        }
        return true;
    }
}
