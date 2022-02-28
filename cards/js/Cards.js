const ANCHOR_SIZE = 5;
const DEFAULT_SIZE = 50;
let choose = "Circle";
let count = 0;

class Cards extends Mixin {
  async _init(args) {
    args = Mixin.getArgs(arguments, { canvasId: String, tick: 125 });
    this.playfield = Playfield.factory({ canvasId: args.canvasId, tick: 1000, fullScreen: true });
    this.deck = Deck.factory({ parent: this.playfield, folder: "decks/startrek-small" });
    this.xxx = XXX.factory(this);
    this.playfield.add(this.xxx);
    this.playfield.start(args.tick);
  }
  deal() {
    let i = 0;
    for (let row of _range(0, 6)) {
      for (let col of _range(0, 13)) {
        let card = this.deck.cards[i++];
        if (!card) continue;
        card.move(col * card.w, row * card.h);
      }
    }
  }
}

class XXX extends PObject {
  static {
    Mixin.mixin({ GraphicsMixin });
  }
  _init(args) {
    args = Mixin.getArgs(arguments, { cards: Cards });
    super._init({});
    this.cards = args.cards;
    this.done = false;
  }
  onTick() {
    if (this.done || !this.cards.deck.cards[0]) return;
    this.cards.deal();
    this.done = true;
  }
}
class Card extends Sprite {
  static {
    Mixin.mixin({ GraphicsMixin });
  }
  _init(args) {
    args = Mixin.getArgs(arguments, { bitmap: ImageBitmap, name: "", x: 0, y: 0, selected: false, suit: String, face: String, value: 0 });
    super._init({ bitmap: args.bitmap, name: args.name, x: args.x, y: args.y, selected: args.selected });
  }
}

class Deck extends Mixin {
  static {
    Mixin.mixin({ GraphicsMixin, BitmapMixin });
  }
   _init(args) {
    args = Mixin.getArgs(arguments, { folder: String, parent: Object });
    this.cards = [];
    this._parent = args.parent;
    this._folder = args.folder;
    this._cw = 0;
    this._ch = 0;
    this._ready = false;
    _spawn(this._loadSprites$.bind(this));
  }
  async _loadSprites$() {
    console.log("_loadSprites$");
    let n = 0;
    await this._loadSheet$(n++, `${this._folder}/diamonds.jpg`);
    await this._loadSheet$(n++, `${this._folder}/clubs.jpg`);
    await this._loadSheet$(n++, `${this._folder}/hearts.jpg`);
    await this._loadSheet$(n++, `${this._folder}/spades.jpg`);
    await this._loadSheet$(n++, `${this._folder}/backs.jpg`);
    await this._loadSheet$(n++, `${this._folder}/backs2.jpg`);
  }
  async _loadSheet$(n, url) {
    console.log("_loadSheet$", n);
    let SUITS = ["diamonds", "clubs", "hearts", "spades", "backs", "backs2"];
    let FACES = ["a", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k"];
    let VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    let sheet = await this.loadImageBitmap$(url);
    console.log("sheet", sheet);
    let bitmaps = await this.splitBitmap$(sheet, 3, 5);
    console.log("bitmaps", bitmaps);

    let i = 0;
    for (let row of _range(0, bitmaps.length)) {
      for (let col of _range(0, bitmaps[row].length)) {
        if (i >= 13) break;
        console.log("_loadSheet$", n, row, col);
        let parms = { bitmap: bitmaps[row][col], suit: SUITS[n], face: FACES[i], value: VALUES[i] };
        let card = Card.factory(parms);
        this._parent.add(card);
        this.cards.push(card);
        i++;
      }
    }
    console.log("cards", this.cards);
  }
}