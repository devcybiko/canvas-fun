class Deck extends Mixin {
  static {
    Mixin.mixin({ GraphicsMixin, BitmapMixin });
  }
   _init(args) {
    args = Mixin.getArgs(arguments, { folder: String, parent: Object });
    this.cards = [];
    this._parent = args.parent;
    this._folder = args.folder;
    _spawn$(this._loadSprites$.bind(this));
  }
  isReady() {
    return this.cards.length === 78;
  }
  async _loadSprites$() {
    let n = 0;
    await this._loadSheet$(n++, `${this._folder}/diamonds.jpg`);
    await this._loadSheet$(n++, `${this._folder}/clubs.jpg`);
    await this._loadSheet$(n++, `${this._folder}/hearts.jpg`);
    await this._loadSheet$(n++, `${this._folder}/spades.jpg`);
    await this._loadSheet$(n++, `${this._folder}/backs.jpg`);
    await this._loadSheet$(n++, `${this._folder}/backs2.jpg`);
  }
  async _loadSheet$(n, url) {
    let SUITS = ["diamonds", "clubs", "hearts", "spades", "backs", "backs2"];
    let FACES = ["a", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k"];
    let VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    let sheet = await this.loadImageBitmap$(url);
    let bitmaps = await this.splitBitmap$(sheet, 3, 5);

    let i = 0;
    for (let row of _range(0, bitmaps.length)) {
      for (let col of _range(0, bitmaps[row].length)) {
        if (i >= 13) break;
        let parms = { bitmap: bitmaps[row][col], suit: SUITS[n], face: FACES[i], value: VALUES[i] };
        let card = Card.factory(parms);
        this._parent.add(card);
        this.cards.push(card);
        i++;
      }
    }
  }
}