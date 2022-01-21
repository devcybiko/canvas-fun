class Board extends PObject {
    static {
        this.mixin({ GraphicsMixin, LoggingMixin });
    }

    static EMPTY = ".";

    _init(args) {
        args = Mixin.getArgs(arguments, {playfield:undefined, rows: 8, cols: 8, x: 0, y: 0});
        super._init(args.playfield, "board", "black", 0, 0, args.playfield.w, args.playfield.h);
        this.rows = args.rows;
        this.cols = args.cols;
        this.CELL_WIDTH = Math.floor(this.w / this.cols);
        this.CELL_HEIGHT = Math.floor(this.h / this.rows);
        this.cells = [];
        this.lastMove = null;
        this.resetBoard();
    }
    resetBoard() {
        this.cells = [];
        for(let r=0; r<this.rows; r++) {
            let row = [];
            for(let c=0; c<this.cols; c++) {
                row.push(this.EMPTY);
            }
            this.cells.push(row);
        }
    }
    draw(ctx) {
    }
    click(x, y) {
        let row = Math.floor(y / this.CELL_HEIGHT);
        let col = Math.floor(x / this.CELL_WIDTH);
        if (!_between(0, row, 2)) return;
        if (!_between(0, col, 2)) return;
        this.lastMove = {row, col};
    }
    cancelLastMove() {
        this.lastCell = null;
        this._lastCol = null;
    }
    getLastMove() {
        return this.lastMove;
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
    go() {
        this.toBack();
    }
}