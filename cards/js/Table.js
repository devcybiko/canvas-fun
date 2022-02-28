class Table extends PObject {
    static {
        Mixin.mixin({ GraphicsMixin });
    }
    _init(args) {
        args = Mixin.getArgs(arguments, { deck: Deck });
        super._init({});
        this.deck = args.deck;
        this.done = false;
    }
    deal() {
        let i = 0;
        let w = this.getParent().w;
        let h = this.getParent().h;
        let W = this.deck.cards[0].w * 13;
        let H = this.deck.cards[0].h * 6;
        let cw = (w - W) / 2;
        let ch = (h - H) / 2;
        for (let row of _range(0, 6)) {
            for (let col of _range(0, 13)) {
                let card = this.deck.cards[i++];
                if (!card) continue;
                card.move(col * card.w + cw, row * card.h + ch);
            }
        }
    }
    onTick() {
        if (this.done || !this.deck.isReady()) return;
        this.onResize();
        this.deal();
        this.done = true;
    }
    onResize() {
        console.log('resize');
        let c = this.deck.cards[0];
        let w = this.getParent().w;
        let h = this.getParent().h;
        c.resize(w / 13);
        let cw = c.w;
        let ch = c.h;
        console.log({ cw, ch, w, h }, cw * 13, ch * 6)
        if (cw * 13 < w && ch * 6 < h) {
            console.log({ w })
            for (let card of this.deck.cards) {
                card.resize(cw);
            }
            this.deal();
        } else {
            c.resize(undefined, h / 6);
            console.log({ h })
            ch = c.h;
            for (let card of this.deck.cards) {
                card.resize(undefined, ch);
            }
            this.deal();
        }
    }
}