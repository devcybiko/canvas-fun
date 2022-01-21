function _log(msg) {
    console.log(...arguments);
}
function _error(msg) {
    console.error(msg);
}
function _between(a, b, c) {
    let result = a <= b && b <= c;
    return result;
}
function _random(min, max) {
    let range = Math.abs(max - min);
    let result = Math.floor(Math.random() * range + min);
    return result;
}
function _classOf(obj) {
    if (obj === undefined) return "undefined";
    if (obj.constructor && obj.constructor.name === "Function") return obj.name;
    if (obj.constructor && obj.constructor.name) return obj.constructor.name;
    if (typeof obj === "string") return "String";
    if (typeof obj === "number") return "Number";
}
function _classesOf(obj) {
    let classes = [];
    let clazz = _classOf(obj);
    classes.push(clazz);
    while(obj && clazz) {
        if (clazz === "Object") break;
        obj = obj.__proto__;
        clazz = _classOf(obj);
        classes.push(clazz);
    }
    classes.push("Object");
    return classes;
}
function _instanceOf(obj, clazz) {
    let classes = _classesOf(obj);
    return classes.includes(clazz);
}
function _isClass(obj) {
    if (obj.constructor && obj.constructor.name === "Function") return obj.name;
}
if (typeof module !== 'undefined') module.exports = {_log,_error,_between,_random,_classOf,_classesOf,_instanceOf,_isClass};
