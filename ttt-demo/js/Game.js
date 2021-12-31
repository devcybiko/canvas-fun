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
        this._playfield.start(args.tick);
        this._rules = new Rules(this._board);
        this._logic = new Logic(this._board, this._rules);
        this.HUMAN = Board.X;
        this.COMPUTER = Board.O;
        this._turn = this.HUMAN;
        this._msg = Message.factory({ playfield, msg:"Tic Tac Toe", timeout:3000 });
    }
    go() {
        if (this._rules.checkWin(Board.X)) {
            this._msg.show("X Wins!", 1000);
            return;
        }
        if (this._rules.checkWin(Board.O)) {
            this._msg.show("O Wins!", 1000);
            return;
        }
        if (this._rules.checkDraw()) {
            this._msg.show("IT'S THE CAT'S GAME!", 1000);
            return;
        }
        let lastMove = this._board.getLastMove();
        if (this._turn === this.HUMAN) {
            if (lastMove) {
                if (this._rules.checkMove(lastMove.row, lastMove.col, this._turn)) {
                    let x = X.factory(this._board, lastMove.row, lastMove.col);
                    this._board.setCell(lastMove.row, lastMove.col, this._turn);
                    this._turn = this.COMPUTER;
                    this.setTimer(1000);
                } else {
                    this._msg.show("Illegal Move. Try Again.", 1000);
                }
                this._board.cancelLastMove();
            }
        } else {
            this._msg.show("Thinking...", 1000);
            if (this.getTimer()) return;
            let move = this._logic.getNextMove(this.COMPUTER, this.HUMAN);
            if (move) {
                let o = O.factory(this._board, move.row, move.col);
                this._board.setCell(move.row, move.col, this._turn);
                this._turn = this.HUMAN;
                this._board.cancelLastMove();
                this._msg.hide();
            } else {
                this._msg("I have no moves", 1000);
            }
        }
    }
}