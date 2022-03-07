class Deck extends Mixin {
   _init(args) {
    args = Mixin.getArgs(arguments, { folder: String, parent: Object, backsFname: "backs.jpg", jokers: false });
    [this._parent, this._folder, this._backsFname, this.jokers] = _delete(args, "parent", "folder", "backsFname", "jokers", "_args_", "_sealed_");
    this.cards = []; // the currently shuffled deck
    this.suits = []; // a well-ordered list of cards by suit
    this._nsuits = 4;
    this._nfaces = 13;
    if (this.jokers) this._nfaces = 14;
    this.deckSize = this._nsuits * this._nfaces;
    this._backBitmap = null;
    this._loadSprites();
  }
  isReady() {
    return this.cards.length === this.deckSize;
  }
  _loadSprites() {
    _spawn$(this._loadSheet$.bind(this), 0, `${this._folder}/diamonds.jpg`);
    _spawn$(this._loadSheet$.bind(this), 1, `${this._folder}/clubs.jpg`);
    _spawn$(this._loadSheet$.bind(this), 2, `${this._folder}/hearts.jpg`);
    _spawn$(this._loadSheet$.bind(this), 3, `${this._folder}/spades.jpg`);
  }
  async _loadSheet$(n, url) {
    if (!this._backBitmap) {
      let sheet = await this.loadImageBitmap$(`${this._folder}/${this._backsFname}`);
      let bitmaps = await this.splitBitmap$(sheet, 3, 5);
      this._backBitmap = bitmaps[0][0];
    }
    let SUITS = ["diamonds", "clubs", "hearts", "spades", "backs", "backs2"];
    let FACES = ["a", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k", "joker", "blank"];
    let VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 0, 0];
    let sheet = await this.loadImageBitmap$(url);
    let bitmaps = await this.splitBitmap$(sheet, 3, 5);

    let i = 0;
    this.suits[n] = [];
    for (let row of _range(0, bitmaps.length)) {
      for (let col of _range(0, bitmaps[row].length)) {
        if (i >= this._nfaces) break;
        let parms = { bitmap: bitmaps[row][col], backBitmap: this._backBitmap, suit: SUITS[n], face: FACES[i], value: VALUES[i], isVisible: false };
        let card = Card.factory(parms);
        this._parent.add(card);
        this.cards.push(card);
        this.suits[n].push(card);
        i++;
      }
    }
  }
}
Mixin.mixin(Deck, { GraphicsMixin, BitmapMixin });
