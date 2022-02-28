class Game {
    constructor(canvasId) {
        this.playfield = Playfield.factory({ canvasId: "my_canvas", tick: 10, fullScreen: true });
        this.deck = Deck.factory({ parent: this.playfield, folder: "decks/startrek-small" });
        this.table = Table.factory(this.deck);
        this.playfield.add(this.table);
        this.playfield.start();
    }
}