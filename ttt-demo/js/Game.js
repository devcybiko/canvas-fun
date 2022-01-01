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
        this._args = args;
        this._xWins = 0;
        this._oWins = 0;
        this._catWins = 0;
        this._reset(this);
    }
    _reset(game) {
        let args = game._args;
        console.log("reset");
        game._playfield.reset();
        game._playfield.add(game);
        game._board = Board.factory(game._playfield, 0, 0, this._playfield.w - 30, this._playfield.h - 30);
        game._rules = new Rules(game._board);
        game._logic = new Logic(game._board, game._rules);
        game.HUMAN = Board.X;
        game.COMPUTER = Board.O;
        game._turn = game.HUMAN;
        game._msg = Message.factory(this._playfield, "Tic Tac Toe", 3000);
        game._label = Label.factory(this._playfield, 0, this._playfield.h - 24, this._playfield.w, 24);
        game._updateScore();
        game._playing = true;
        game._playfield.add(game);
        game._playfield.start(args.tick);
        game._updateScore();
    }
    _updateScore() {
        this._label.setText(`X: ${this._xWins}          O: ${this._oWins}            Cat: ${this._catWins}`);
    }
    go() {
        if (!this._playing) return;
        if (this._rules.checkWin(Board.X)) {
            this._msg.show("X Wins!", 1000, this._reset, this);
            this._logic.updateOutcome(Logic.LOSS);
            this._playing = false;
            this._xWins++;
            return;
        }
        if (this._rules.checkWin(Board.O)) {
            this._msg.show("O Wins!", 1000, this._reset, this);
            this._logic.updateOutcome(Logic.WIN);
            this._playing = false;
            this._oWins++;
            return;
        }
        if (this._rules.checkDraw()) {
            this._msg.show("IT'S THE CAT'S GAME!", 1000, this._reset, this);
            this._logic.updateOutcome(Logic.DRAW);
            this._playing = false;
            this._catWins++;
            return;
        }
        let lastMove = this._board.getLastMove();
        if (this._turn === this.HUMAN) {
            if (lastMove) {
                if (this._rules.checkMove(lastMove.row, lastMove.col, this._turn)) {
                    let x = X.factory(this._board, lastMove.row, lastMove.col);
                    this._board.setCell(lastMove.row, lastMove.col, this._turn);
                    this._turn = this.COMPUTER;
                    this.setTimer(125);
                } else {
                    this._msg.show("Illegal Move. Try Again.", 1000);
                }
                this._board.cancelLastMove();
            }
        } else {
            this._msg.show("Thinking...", 1);
            if (this.getTimer()) return;
            console.log();
            let move = this._logic.memoryMove(this.COMPUTER, this.HUMAN);
            if (move) {
                let o = O.factory(this._board, move.row, move.col);
                this._board.setCell(move.row, move.col, this._turn);
                this._turn = this.HUMAN;
                this._board.cancelLastMove();
                this._msg.hide();
            } else {
                this._msg.show("I have no moves", 1000);
            }
        }
    }
}