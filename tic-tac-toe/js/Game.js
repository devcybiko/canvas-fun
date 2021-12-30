class TicTacToe extends PObject {
    static factory(args) {
        let obj = new this(null);
        obj._init(...arguments);
        Mixin.seal(obj);
        return obj;
    }
    _init(args) {
        args = Mixin.getArgs(arguments, { canvasId: undefined, tick: 125 });
        const playfield = Playfield.factory(args.canvasId);
        super._init(playfield);
        this._board = Board.factory(playfield);
        this._msg = Message.factory({ playfield });
        this._msg.show("Tic Tac Toe", 3000, (ctx) => { ctx._msg.show("Your Move", 1000) }, this);
        this._rules = Rules.factory(this._board);
        this._logic = new Logic(this._board, this._rules);
        this._counter = 0;
        this.HUMAN = "X";
        this.COMPUTER = "O";
        this._turn = this.HUMAN;
        playfield.start(args.tick);
    }
    go() {
        if (this._rules.checkWin(Board.X)) {
            this._msg.show("X WINS!", 10000)
            return;
        }
        if (this._rules.checkWin(Board.O)) {
            this._msg.show("O WINS!", 10000);
            return;
        }
        if (this._rules.checkDraw()) {
            this._msg.show("ITS THE CATS GAME!", 10000);
            return;
        }
        if (this._turn === this.HUMAN) {
            let lastMove = this._board.getLastMove();
            if (lastMove) {
                this._msg.hide();
                if (this._rules.checkMove(lastMove.row, lastMove.col, Board.X)) {
                    X.factory(this._board, lastMove.row, lastMove.col);
                    this._board.cancelLastMove();
                    this._board.setCell(lastMove.row, lastMove.col, Board.X);
                    this._turn = this.COMPUTER;
                    this.setTimer(1000);
                } else {
                    this._msg.show("Illegal Move. Try Again");
                    this._board.cancelLastMove();
                }
                return;
            }
        }
        if (this._turn === this.COMPUTER) {
            this._msg.show("Thinking...", 1000);
            if (this.getTimer()) return;
            this._msg.hide();
            let move = this._logic.getNextMove("O", "X");
            if (move) {
                O.factory(this._board, move.row, move.col);
                this._board.setCell(move.row, move.col, Board.O);
                this._turn = this.HUMAN;
                this._msg.show("Your Move", 1000);
                this._board.cancelLastMove();
                return;
            } else {
                this._msg.show("ERROR: No Moves", 3000);
            }
        }
    }
}
