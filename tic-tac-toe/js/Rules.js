class Rules {
    static factory(args) {
        let obj = new this(null);
        obj._init(...arguments);
        Mixin.seal(obj);
        return obj;
    }
    _init(args) {
        args = Mixin.getArgs(arguments, {board:undefined});
        this._board = args.board;
    }
    checkMove(row, col, who) {
        if (this._board.getCell(row, col) === Board.EMPTY) return true;
        return false;
    }
    checkWin(who) {
        let www = who.repeat(3);
        for (let i of [0, 1, 2]) {
            if (this._board.getRow(i) === www) return true;
            if (this._board.getCol(i) === www) return true;
        }
        if (this._board.getDiag1() === www) return true;
        if (this._board.getDiag2() === www) return true;
        return false;
    }
    checkDraw() {
        for(let row of [0,1,2]) {
            for(let col of [0,1,2]) {
                if (this._board.getCell(row, col) === Board.EMPTY) return false;
            }
        }
        return true;
    }
}