class Logic {
    static memory = [
        { board: "", move: { row: 0, col: 0 }, outcome: 0 }
    ];
    static WIN = 3;
    static DRAW = 2
    static NONE = 1;
    static LOSS = 0;

    constructor(board, rules) {
        this._board = board;
        this._rules = rules;
        this._moves = [];
    }

    allAvailableMoves() {
        let moves = [];
        for (let row in [0, 1, 2]) {
            for (let col in [0, 1, 2]) {
                if (this._board.getCell(row, col) === Board.EMPTY)
                    moves.push({ row, col, outcome: Logic.NONE });
            }
        }
        console.log("allAvailableMoves", moves);
        return moves;
    }
    randomElement(arr) {
        let el = null;
        console.log({ arr });
        if (arr.length) {
            let rnd = _random(0, arr.length);
            console.log({ rnd });
            el = arr[rnd];
            console.log({ el });
        }
        return el;
    }
    randomMove() {
        let moves = this.allAvailableMoves();
        let move = this.randomElement(moves);
        console.log("randomMove", move);
        return move;
    }
    memoryMove() {
        let currentBoard = this._board.getRow(0) + this._board.getRow(1) + this._board.getRow(2);
        let moves = Logic.memory[currentBoard];
        if (!moves) {
            moves = this.allAvailableMoves();
            Logic.memory[currentBoard] = moves;
        }
        let bestMove = null;
        for (let move of moves) {
            if (!bestMove || bestMove.outcome < move.outcome) bestMove = move;
        }
        if (!bestMove) bestMove = this.randomMove();
        else if (bestMove.outcome === Logic.LOSS) this.updateOutcome(Logic.LOSS);

        this._moves.push(bestMove);
        return bestMove;
    }
    updateOutcome(outcome) {
        console.log("moves", this._moves);
        let lastMove = this._moves[this._moves.length - 1];
        if (lastMove && lastMove.outcome > outcome) lastMove.outcome = outcome;
        console.log(lastMove);
    }
}
