class Foo {
}

let bar = {
	xxx: "yyy"
}

let foo = new Foo();

console.log(foo.constructor.name);
console.log(bar.constructor.name);
