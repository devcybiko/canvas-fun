function _log(msg) {
    console.log(...arguments);
}
function _error(msg) {
    console.error(...arguments);
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

function _range(a, b) {
    let result = [];
    for(let i=a; i<b; i++) {
        result.push(i);
    }
    return result;
}

async function _spawnCallback$(_asyncFunction$, args=[]) {
    await _asyncFunction$(...args);
}
function _spawn$(_asyncFunction$, ...args) {
    return setTimeout(_spawnCallback$, 1, _asyncFunction$, args);
}

function _delete(obj, ...keys) {
    let oldValues = [];
    for(let key of keys) {
        if (key in obj) {
            oldValues.push(obj[key]);
            delete obj[key];
        }
        else oldValues.push(undefined);
    }
    return oldValues;
}
// if (typeof module !== 'undefined') module.exports = {_log,_error,_between,_random,_classOf,_classesOf,_instanceOf,_isClass,_range};
