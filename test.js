let s = "A";
let S = String;
console.log(s instanceof S);
console.log(s instanceof String);
class C extends Object {}
class D extends C {}

let c = new C();
let CC = C;
let DD = D;

console.log(c instanceof C);
console.log(c instanceof CC);
console.log((typeof s));
console.log(typeof S);
console.log((typeof c));
let n = 100.0;
console.log(typeof n);

console.log(DD.name);
console.log(DD.__proto__.name);
console.log(DD.__proto__.__proto__);

