class Foo {
	constructor() {
	}
}

const Bar = {
	_initialize() {
	},
    Bar(foo) {
    }
}

console.log(Object.keys(Foo.prototype));

console.log(Bar);

function varToString(varObj) {
    console.log(typeof varObj);
    let name = Object.keys(varObj)[0];
    console.log(typeof name);
    return name;
}

const someVar = 42

const displayName = varToString({Bar})
console.log(displayName)
