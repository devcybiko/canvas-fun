class Tableau extends PObject {
    _init(args) {
        args = Mixin.getArgs(arguments, {});
        super._init({});
        this.done = false;
        this._color = "white";
        this._fillColor = "green";
        this.stack = [];
        this.waste = [];
        this.foundations = GArrays.matrix([4, 1]);
        this.piles = GArrays.matrix([7]);
    }

    setup() {
        this.buildMenu();
        this.layout = PLayout.factory(0, 0, 1.0, 1.0);
        this.getParent.add(layout);
        this.deck = Deck.factory({ parent: this.layout, folder: "decks/startrek-small" });

    }
    buildMenu() {
        this.menu = PLayout.factory({ name: "menu", xPercent: 0, yPercent: 0, wPercent: 1.0, hPercent: 25 });
        this.getParent().add(this.menu);
        let homeButton = Button.factory({ name: "home", text: "Home", x: 0, y: 0, w: 10, h: 10, selected: true });
        let stopButton = Button.factory({ name: "stop", text: "Stop", x: 0, y: 0, w: 10, h: 10 });
        let circleButton = Button.factory({ name: "circle", text: "Circle", x: 0, y: 0, w: 10, h: 10});
        this.menu.add(homeButton, 0, 0, 0.25, 1);
        this.menu.add(rectButton, 0.25, 0, 0.25, 1);
        this.menu.add(circleButton, 0.50, 0, 0.25, 1);
        this.menu.toFront();
    }
    deal() {
        let w = this.getParent().w;
        let h = this.getParent().h;
        let W = this.deck.cards[0].w * 13;
        let H = this.deck.cards[0].h * 6;
        let cw = (w - W) / 2;
        let ch = (h - H) / 2;
        for (let row of _range(0, 6)) {
            for (let col of _range(0, 13)) {
                let card = this.deck.suits[row][col];
                if (!card) continue;
                card.move(col * card.w + cw, row * card.h + ch);
            }
        }
    }
    onTick() {
        if (this.done || !this.deck.isReady()) return;
        this.setup();
        this.onResize();
        this.deal();
        this.done = true;
    }
    onDraw() {
        this.debug("onDraw", this);
        this.toBack();
        this.rect({ x: 0, y: 0, w: this.w, h: this.h })
    }
    onResize() {
        this.resize(this.getParent().w, this.getParent().h);
        if (!this.layout) this.setup();
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
Mixin.mixin(Tableau, { LoggingMixin, GraphicsMixin });
