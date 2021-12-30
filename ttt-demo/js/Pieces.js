class Piece extends PObject {
    static {
        this.mixin({ GraphicsMixin });
        this.mixin({ LoggingMixin });
    }
    static factory(args) {
        let obj = new this(null);
        obj._init(...arguments);
        Mixin.seal(obj);
        return obj;
    }
    _init(args) {
        args = Mixin.getArgs(arguments, {board:undefined, row:undefined, col:undefined});
        super._init(args.board._playfield, "", "black", 0, 0, args.board.CELL_HEIGHT, args.board.CELL_WIDTH);
        this._board = args.board;
        this.move(args.row, args.col);
    }
    move(row, col) {
        this._y = row * this.h;
        this._x = col * this.w;
        this._row = row;
        this._col = col;
    }
    draw(ctx) {
        this.line(ctx, "black", this.x, this.y, this.x + this.w, this.y + this.h);
        this.line(ctx, "black", this.x + this.w, this.y, this.x, this.y + this.h);
    }
}

class X extends PObject {
    static {
        this.mixin({ GraphicsMixin });
        this.mixin({ LoggingMixin });
    }
    static factory(args) {
        let obj = new this(null);
        obj._init(...arguments);
        Mixin.seal(obj);
        return obj;
    }
    _init(args) {
        args = Mixin.getArgs(arguments, {board:undefined, row:undefined, col:undefined});
        super._init(args.board._playfield, "", "black", 0, 0, args.board.CELL_HEIGHT, args.board.CELL_WIDTH);
        this._board = args.board;
        this.move(args.row, args.col);
    }
    move(row, col) {
        this._y = row * this.h;
        this._x = col * this.w;
        this._row = row;
        this._col = col;
    }
    draw(ctx) {
        this.line(ctx, "black", this.x, this.y, this.x + this.w, this.y + this.h);
        this.line(ctx, "black", this.x + this.w, this.y, this.x, this.y + this.h);
    }
}

class O extends PObject {
    static {
        this.mixin({ GraphicsMixin });
        this.mixin({ LoggingMixin });
    }
    static factory(args) {
        let obj = new this(null);
        obj._init(...arguments);
        Mixin.seal(obj);
        return obj;
    }
    _init(args) {
        args = Mixin.getArgs(arguments, {board:undefined, row:undefined, col:undefined});
        super._init(args.board._playfield, "", "black", 0, 0, args.board.CELL_HEIGHT, args.board.CELL_WIDTH);
        this._board = args.board;
        this.move(args.row, args.col);
    }
    move(row, col) {
        this._y = row * this.h;
        this._x = col * this.w;
        this._row = row;
        this._col = col;
    }
    draw(ctx) {
        this.circle(ctx, "black", this.x, this.y, this.w / 2);
    }
}
