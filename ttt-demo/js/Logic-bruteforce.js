class Logic {
    static memory = [
        { board: "", move: { row: 0, col: 0 }, outcome: 0 }
    ];
    static WIN = 3;
    static DRAW = 2
    static LOSS = 1;
    static NONE = 0;

    constructor(board, rules) {
        this._board = board;
        this._rules = rules;
        this._moves = [];
    }

    allAvailableMoves(board) {
        let moves = [];
        for (let row of [0, 1, 2]) {
            for (let col of [0, 1, 2]) {
                if (this._board.getCell(row, col) === Board.EMPTY)
                    moves.push({ row, col, outcome: Logic.NONE, board });
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
    setLastOf(arr, value) {
        if (arr.length) arr[arr.length-1].outcome = value;
        return null;
    }
    minOutcome(moves) {
        let min = 99;
        for(let move of moves) {
            if (move.outcome < min) min = move.outcome;
        }
        return min === 99 ? 0 : min;
    }

    percolate(outcome) {
        this._moves.reverse();
        console.log("percolate", this._moves);
        for(let move of this._moves) {
            move.outcome = outcome;
            let siblings = Logic.memory[move.board];
            outcome = this.minOutcome(siblings);
        }
    }
    memoryMove() {
        let currentBoard = this._board.getRow(0) + this._board.getRow(1) + this._board.getRow(2);
        let moves = Logic.memory[currentBoard];
        if (!moves) {
            moves = this.allAvailableMoves(currentBoard);
            Logic.memory[currentBoard] = moves;
        }
        let bestMove = null;
        let bestMoves = [[],[],[],[]];
        for (let move of moves) {
            bestMoves[move.outcome].push(move);
        }
        console.log(bestMoves);

        for(let options of [bestMoves[Logic.WIN],bestMoves[Logic.NONE],bestMoves[Logic.DRAW],bestMoves[Logic.LOSS]]) {
            // if (options.length) bestMove = options[0];
            if (options.length) bestMove = this.randomElement(options);
            if (bestMove) break;
        }
        console.log({bestMove});
        this._moves.push(bestMove);
        return bestMove;
    }
    updateOutcome(outcome) {
        console.log("moves", this._moves);
        this.percolate(outcome);
    }
}
