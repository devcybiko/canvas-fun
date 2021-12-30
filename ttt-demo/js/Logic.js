class Logic {
    constructor(board, rules) {
        this._board = board;
        this._rules = rules;
    }
    mightWin(who) {
        for (let row of [0, 1, 2]) {
            for (let col of [0, 1, 2]) {
                if (this._board.getCell(row, col) === Board.EMPTY) {
                    this._board.setCell(row, col, who);
                    let win = this._rules.checkWin(who);
                    this._board.setCell(row, col, Board.EMPTY);
                    if (win) return { row, col };
                }
            }
        }
        return false;
    }

    bookMoves = [
        {row: 1, col: 1, rRow: 0, rCol: 0},
        {row: 1, col: 1, rRow: 0, rCol: 2},
        {row: 1, col: 1, rRow: 2, rCol: 0},
        {row: 1, col: 1, rRow: 2, rCol: 2},
        {row: 0, col: 0, rRow: 1, rCol: 1},
        {row: 0, col: 2, rRow: 1, rCol: 1},
        {row: 2, col: 0, rRow: 1, rCol: 1},
        {row: 2, col: 2, rRow: 1, rCol: 1},
        {row: 0, col: 1, rRow: 1, rCol: 1},
        {row: 1, col: 0, rRow: 1, rCol: 1},
        {row: 1, col: 2, rRow: 1, rCol: 1},
        {row: 1, col: 1, rRow: 1, rCol: 1},
    ];
    getBookMove(who, other) {
        let moves = [];
        for (let row in [0, 1, 2]) {
            for (let col in [0, 1, 2]) {
                if (this._board.getCell(row, col) === other)
                    moves.push({row, col});
            }
        }
        if (moves.length !== 1) return [];
        let theFirstMove = moves[0];
        console.log(theFirstMove);
        let responses = [];
        for(let bookMove of this.bookMoves) {
            if (bookMove.row == theFirstMove.row && bookMove.col == theFirstMove.col) {
                responses.push({row: bookMove.rRow, col: bookMove.rCol});
            }
        }
        return responses;
    }

    getNextMove(who, other) {
        let win = this.mightWin(who);
        if (win) return win;
        let block = this.mightWin(other);
        if (block) return block;

        let bookMoves = this.getBookMove(who, other);
        console.log(bookMoves);
        if (bookMoves.length) return bookMoves[_random(0, bookMoves.length-1)];

        let moves = [];
        for (let row in [0, 1, 2]) {
            for (let col in [0, 1, 2]) {
                if (this._board.getCell(row, col) === Board.EMPTY)
                    moves.push({row, col});
            }
        }
        if (moves.length) return moves[_random(0, moves.length)];
        return null;
    }
}
