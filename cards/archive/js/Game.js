class Game {
    constructor(canvasId) {
        try {
            this.playfield = Playfield.factory({ canvasId: "my_canvas", tick: 1000, fullScreen: true });
            // this.panicButton = UI.button({ playfield: playfield, text: "STOP", x: 0, y: 0, w: 0, h: 0, callback: () => _panic_button_ = true, context: {} });
            // this.tableau = Tableau.factory();
            this.menu = this.buildMenu();
            this.playfield.add(this.menu);
            this.menu.toFront();
            // this.layout.add(tableau, 0, 25, 1.0, 1.0);
            this.playfield.start();
        } catch(e) {
            _error(e);
            _panic_button_ = true;
        }
    }
    buildMenu() {
        _log("buildMenu")
        let menu = Menu.factory({ name: "menu", xPercent: 0, yPercent: 0, wPercent: 1.0, hPercent: 25 });
        let homeButton = Button.factory({ name: "home", text: "Home", x: 0, y: 0, w: 10, h: 10 });
        let rectButton = Button.factory({ name: "rect", text: "Rectangle", x: 0, y: 0, w: 10, h: 10 });
        let circleButton = Button.factory({ name: "circle", text: "Circle", x: 0, y: 0, w: 10, h: 10, selected: true });

        _log(menu, homeButton, rectButton, circleButton);
        menu.add(homeButton, 0, 0, 0.25, 1);
        menu.add(rectButton, 0.25, 0, 0.25, 1);
        menu.add(circleButton, 0.50, 0, 0.25, 1);
        return menu;
    }
}


