let n = 125;
let s = "test";
class C {
	fn() {};
}
class D extends C {
}

let CC = C;
let DD = D;

let c = new C();
let d = new D();
function fn() {}

console.log("C.name", C.name);
console.log("C.prototype", C.prototype);
console.log("C.constructor", C.constructor);
console.log("C.constructor.name", C.constructor.name);
console.log("C.instanceof Object", C instanceof Object);
console.log("typeof C", typeof C);
console.log("d instanceof CC", d instanceof CC);
console.log("d instanceof DD", d instanceof DD);
console.log("\n");

console.log("String.constructor.name", String.constructor.name);
console.log("String.name", String.name);
console.log("n.name", n.name);
console.log("s.name", s.name);
console.log("c.name", c.name);
console.log("n.constructor.name", n.constructor.name);
console.log("s.constructor.name", s.constructor.name);
console.log("c.constructor.name", c.constructor.name);
console.log("\n");

console.log("fn.name", fn.name);
console.log("fn.prototype", fn.prototype);
console.log("fn.constructor", fn.constructor);
console.log("fn.constructor.name", fn.constructor.name);
console.log("fn.instanceof Object", fn instanceof Object);
console.log("typeof fn", typeof fn);
console.log("\n");

function isClass(obj) {
	if (obj instanceof Function) return obj.name;
	return undefined;
}
function isFunction(obj) {
	if (obj instanceof Function) return obj.name;
	return undefined;
}
function isInstance(obj) {
	if (obj instanceof Function) return obj.name;
	return undefined;
}

console.log("isClass(C)", isClass(C));
console.log("isClass(fn)", isClass(fn));
console.log("isClass(n)", isClass(n));

