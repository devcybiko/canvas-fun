class TestDeck {
    constructor(canvasId) {
        try {
            _log("TestDeck");
            this.playfield = Playfield.factory({ canvasId: canvasId, tick: 50, fullScreen: true });
            this.deck = Deck.factory("decks/startrek", this.playfield, "backs2.jpg", false);
            this.dummy = Dummy.factory(this.deck);
            this.playfield.add(this.dummy);
            this.playfield.start();
        } catch (e) {
            console.error(e);
            _panic_button_ = true;
        }
    }
}

class Dummy extends PObject {
    _init(args) {
        args = Mixin.getArgs(arguments, { deck: Deck });
        this.deck = args.deck;
        super._init();
    }
    onTick() {
        if (!this.onTick.done) {
            _log("tick");
            if (this.deck.isReady()) {
                this.resizeAllCards(this.getParent().w, this.getParent().h);
                this.deal();
                this.onTick.done = true;
            }
        }
    }
    deal() {
        let row = 0;
        let i = 0;
        let sample = this.deck.cards[0];
        for (let suit of this.deck.suits) {
            let col = 0;
            for (let card of suit) {
                card.move(col * sample.w, row * sample.h);
                card.show(true);
                if (i % 3 === 0) card.setFaceUp(false)
                else card.setFaceUp(true);
                col++;
                i++;
            }
            row++;
        }
    }
    onResize(x, y, w, h) {
        this.resize(w, h);
        this.resizeAllCards(w,h);
        this.deal();
    }
    resizeAllCards(w, h) {
        let ROWS = 4;
        let COLS = this.deck.suits[0].length;
        let c = this.deck.cards[0];
        c.resize(w / COLS);
        let cw = c.w;
        let ch = c.h;
        if (cw * COLS < w && ch * ROWS < h) {
            for (let card of this.deck.cards) {
                card.resize(cw);
            }
        } else {
            c.resize(undefined, h / ROWS);
            ch = c.h;
            for (let card of this.deck.cards) {
                card.resize(undefined, ch);
            }
        }
    }
}