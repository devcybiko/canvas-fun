const playfield = new Playfield('#my_canvas');
playfield.add(new Box("RED", "red", 0, 0, 100, 100, 10, 10));
playfield.add(new Box("GREEN", "green", 250, 250, 50, 50, -10, -10));
playfield.add(new Box("ORANGE", "orange", 200, 125, 50, 25, -5, 0));
playfield.add(new Box("BLUE", "blue", 250, 250, 50, 50, -20, -20));
playfield.start();