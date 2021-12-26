# project-550-playefield-animation

## Playfield.js
```js
const Meanderer = {
    Meanderer() { // all mixins must have an init method
        this.dx = random(-10, 10);
        this.dy = random(-10, 10);
    },
    go() {
        if (this.isSelected) return;
        this.x += this.dx;
        this.y += this.dy;

        let collisions = this.playfield.collisions(this);
        if (collisions.length) {
            this.dx = random(-10, 10);
            this.dy = random(-10, 10);
        }

        if (this.x < 0) {
            this.x = 0;
            this.dx = -this.dx;
        }
        if (this.x + this.w > this.playfield.canvas.width) {
            this.x = this.playfield.canvas.width - this.w;
            this.dx = -this.dx;
        }
        if (this.y < 0) {
            this.y = 0;
            this.dy = -this.dy;
        }
        if (this.y + this.h > this.playfield.canvas.height) {
            this.y = this.playfield.canvas.height - this.h;
            this.dy = -this.dy;
        }
    }
}
...
class Box extends PObject {
    static {
        mixin(Box, Meanderer);
    }
...
class Circle extends PObject {
    static {
        mixin(Circle, Meanderer);
    }
...
function mixin(clazz, mixer) {
    Object.assign(clazz.prototype, mixer);
}
```

## Summary
* Mixins are a way to add methods to a class - a sideways kludge for multiple inheritance
* We've created the `mixin(clazz, mixer)` function to make mixins easier
* We've modified the `Meanderer` class to be a hash filled with functions to add in
  * `Meanderer::Meanderer` is an initialization function
  * By convention, I've decided to name the init function the same as the Mixin
  * If something "mixes in" a Mixin, it's expected it will call the Mixin's init function
* The `Manderer::go()` method is the same as before, as is the init method
* `Box` and `Circle` are the same as before, 
  * to make them a 'mixin', they call `mixin()` in their `static initializer` function
  * `static initializers` are functions that are called once to add static data to a class
  * we're using it here to extend the class - basically giving us multiple inheritance
  * Both `Box` and `Circle` call the `Meanderer::Meanderer()` init function