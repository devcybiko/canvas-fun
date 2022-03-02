let assert = {
    equals(actual, expected) {
        if (actual !== expected) console.error(new Error(`got ${actual} expected ${expected}`))
    },
    notEquals(actual, expected) {
        if (actual === expected) console.error(new Error(`got ${actual} expected ${expected}`))
    },
}

module.exports = assert;