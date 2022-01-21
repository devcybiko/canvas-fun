class Foo {
  constructor() {
    this.y = "Y";
    setInterval(this.callback.bind(this), 1000, "X");
  }
  callback(x) {
    console.log(x,this.y);
  }
}

let foo = new Foo();