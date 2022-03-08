
class Scribble extends Mixin {
  _init(args) {
    args = Mixin.getArgs(arguments, { canvasId: String, tick: 125 });
    this.playfield = Playfield.factory({ canvasId: args.canvasId, tick: 125, fullScreen: true });
    this.buildScribble(this.playfield);
    this.playfield._data.scribble = this;
    this.playfield.resize();
    // this.playfield.start();
  }
  buildScribble(playfield) {
    this.buildDrawTable(playfield);
    this.buildMenu(playfield);
    this.group = Group.factory({name: "group"});
    playfield.add(this.group);
  }
  buildDrawTable(playfield) {
    this.drawTable = DrawTable.factory(this);
    playfield.add(this.drawTable)
    this.drawTable.toBack();
  }
  buildMenu(playfield) {
    this.menu = PLayout.factory({ name: "menu", xPercent: 0, yPercent: 0, wPercent: 1.0, hPercent: 25 });
    playfield.add(this.menu);
    this.homeButton = Button.factory({ name: "home", text: "Home", x: 0, y: 0, w: 10, h: 10 });
    this.rectButton = Button.factory({ name: "rect", text: "Rectangle", x: 0, y: 0, w: 10, h: 10 });
    this.circleButton = Button.factory({ name: "circle", text: "Circle", x: 0, y: 0, w: 10, h: 10, selected: true });
    this.menu.add(this.homeButton, 0, 0, 0.25, 1);
    this.menu.add(this.rectButton, 0.25, 0, 0.25, 1);
    this.menu.add(this.circleButton, 0.50, 0, 0.25, 1);
    this.menu.toBack();
  }
  reset() {
    for (let obj of this.drawTable.list) {
      this.playfield.removeChild(obj);
    }
    this.drawTable.list = [];
  }
}