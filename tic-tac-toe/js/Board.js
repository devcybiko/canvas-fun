class Board extends PObject {
    static {
        this.mixin({ GraphicsMixin });
        this.mixin({ LoggingMixin });
    }

    static X = "X";
    static O = "O";
    static EMPTY = ".";

    static factory(args) {
        let obj = new this(null);
        obj._init(...arguments);
        Mixin.seal(obj);
        return obj;
    }
    _init(args) {
        args = Mixin.getArgs(arguments, {playfield:undefined});
        super._init(args.playfield, "board", "black", 0, 0, args.playfield.w, args.playfield.h);
        this.CELL_WIDTH = Math.floor(this.w / 3);
        this.CELL_HEIGHT = Math.floor(this.h / 3);
        this._cells = [[".", ".", "."], [".", ".", "."], [".", ".", "."]];
    }
    draw(ctx) {
        this.line(ctx, "black", this.CELL_WIDTH, 0, this.CELL_WIDTH, this.h);
        this.line(ctx, "black", this.CELL_WIDTH * 2, 0, this.CELL_WIDTH * 2, this.h);
        this.line(ctx, "black", 0, this.CELL_HEIGHT, this.w, this.CELL_HEIGHT);
        this.line(ctx, "black", 0, this.CELL_HEIGHT * 2, this.w, this.CELL_HEIGHT * 2);
    }
    click(x, y) {
        let row = Math.floor(y / this.CELL_HEIGHT);
        let col = Math.floor(x / this.CELL_WIDTH);
        if (!_between(0, row, 2)) return;
        if (!_between(0, col, 2)) return;
        this._lastRow = row;
        this._lastCol = col;
    }
    cancelLastMove() {
        this._lastRow = null;
        this._lastCol = null;
    }
    getLastMove() {
        if (this._lastRow != null) return {row: this._lastRow, col: this._lastCol};
        return null;
    }
    getCell(row, col) {
        return this._cells[row][col];
    }
    setCell(row, col, piece) {
        this._cells[row][col] = piece;
    }
    getCol(col) {
        return this._cells[0][col] + this._cells[1][col] + this._cells[2][col];
    }
    getRow(row) {
        return this._cells[row].join("");
    }
    getDiag1() {
        return this._cells[0][0] + this._cells[1][1] + this._cells[2][2];
    }
    getDiag2() {
        return this._cells[2][0] + this._cells[1][1] + this._cells[0][2];
    }
    go() {
        this.toBack();
    }
}