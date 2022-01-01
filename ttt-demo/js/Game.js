class TicTacToe extends PObject {
    static factory(args) {
        let obj = new this(null);
        obj._init(...arguments);
        Mixin.seal(obj);
        return obj;
    }
    static learn = false;
    static _delay = 1000;

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
        game._msg = Message.factory(this._playfield, "Tic Tac Toe", TicTacToe._delay);
        game._label = Label.factory(this._playfield, 0, this._playfield.h - 24, this._playfield.w/2, 24);
        game._learnButton = Button.factory(this._playfield, "LEARN!", this._playfield.w/4*2,  this._playfield.h - 24, this._playfield.w/4, 24, game._learn, game);
        game._speedButton = Button.factory(this._playfield, "SPEED!", this._playfield.w/4*3,  this._playfield.h - 24, this._playfield.w/4, 24, game._speed, game);
        game._updateScore();
        game._playing = true;
        game._playfield.add(game);
        game._playfield.start(args.tick);
        game._updateScore();
    }
    _learn(game) {
        TicTacToe.learn = !TicTacToe.learn;
        console.log("LEARN!", TicTacToe.learn);
    }
    _speed(game) {
        if (game._playfield._tick != 1) {
            game._playfield.stop();
            game._playfield._tick = 1;
            TicTacToe._delay = 1;
            game._playfield.start();
        } else {
            game._playfield.stop();
            game._playfield._tick = 125;
            TicTacToe._delay = 1000;
            game._playfield.start();
        }
        console.log("SPEED!", TicTacToe.learn);
    }
    _updateScore() {
        this._label.setText(`X: ${this._xWins}          O: ${this._oWins}            Cat: ${this._catWins}`);
    }
    go() {
        if (!this._playing) return;
        if (this._rules.checkWin(Board.X)) {
            this._msg.show("X Wins!", TicTacToe._delay, this._reset, this);
            this._logic.updateOutcome(Logic.LOSS);
            this._playing = false;
            this._xWins++;
            return;
        }
        if (this._rules.checkWin(Board.O)) {
            this._msg.show("O Wins!", TicTacToe._delay, this._reset, this);
            this._logic.updateOutcome(Logic.LOSS);
            this._playing = false;
            this._oWins++;
            return;
        }
        if (this._rules.checkDraw()) {
            this._msg.show("IT'S THE CAT'S GAME!", TicTacToe._delay, this._reset, this);
            this._logic.updateOutcome(Logic.DRAW);
            this._playing = false;
            this._catWins++;
            return;
        }
        if (this._turn === this.HUMAN) {
            let lastMove = this._board.getLastMove();
            if (TicTacToe.learn) {
                lastMove = this._logic.memoryMove(this.COMPUTER, this.HUMAN);
            }
            if (lastMove) {
                if (this._rules.checkMove(lastMove.row, lastMove.col, this._turn)) {
                    let x = X.factory(this._board, lastMove.row, lastMove.col);
                    this._board.setCell(lastMove.row, lastMove.col, this._turn);
                    this._turn = this.COMPUTER;
                    this.setTimer(TicTacToe._delay);
                } else {
                    this._msg.show("Illegal Move. Try Again.", TicTacToe._delay);
                }
                this._board.cancelLastMove();
            }
        } else {
            this._msg.show("Thinking...", TicTacToe._delay);
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
                this._msg.show("I have no moves", TicTacToe._delay);
            }
        }
    }
}