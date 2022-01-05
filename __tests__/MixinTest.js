"use strict";

const Mixin = require("../js/Mixin.js");
class Foo extends Mixin {
    log() {
        console.log(this.a, this.b);
    }
}
class Baz {
    constructor() {
    }
}
class Bar extends Mixin {
    _init(a, b) {
        this.a = a;
        this.b = b;
    }
    log() {
        console.log(this.a, this.b);
    }
}
class Bizzle extends Mixin {
    _init() {
        let args = Mixin.getArgs(arguments, { baz: Baz, a: String, b: "optional" });
        Object.assign(this, args);
    }
}
// jest.mock( "../src/calc" );

describe("Mixin", () => {
    beforeAll(() => {
        console.log("beforeAll executes once before all tests");
        // calc.add.mockImplementation( () => -1 );
    });

    afterAll(() => {
        console.log("afterAll executes once after all tests");
    });

    describe("constructor", () => {
        beforeEach(() => {
            console.log("beforeEach executes before every test");
        });

        it("should throw an exception when calling empty constructor", () => {
            expect(() => {
                let foo = new Foo();
            }).toThrowError("USE THE FACTORY METHOD");
        });
        it("should throw an exception when calling non-empty constructor", () => {
            expect(() => {
                let foo = new Foo("Some Args");
            }).toThrowError("USE THE FACTORY METHOD");
        });
    });

    describe("factory", () => {
        it("should throw an exception when missing _init() method", () => {
            expect(() => {
                let foo = Foo.factory();
            }).toThrowError("Mixin classes need an _init() method");
        });
        it("should throw an exception when missing _init() method", () => {
            expect(() => {
                let foo = Foo.factory();
            }).toThrowError("Mixin classes need an _init() method");
        });
        it("should call the _init() method", () => {
            let bar = Bar.factory("A", "B");
            expect(bar.a).toBe("A");
        });
        it("should seal the object for 'read'", () => {
            let bar = Bar.factory("A", "B");
            expect(() => { bar.greg }).toThrowError("No such property: greg");
        });
        it("should seal the object for 'update'", () => {
            let bar = Bar.factory("A", "B");
            expect(() => { bar.greg = "Greg" }).toThrowError("Cannot create a new property: greg");
        });
    });
    describe("Mixin.getArgs", () => {
        it("should Mixin.getArgs with positional parameters", () => {
            let baz = new Baz();
            let bizzle = Bizzle.factory(baz, "A", "B");
            expect(bizzle.baz).toBe(baz);
            expect(bizzle.a).toBe("A");
            expect(bizzle.b).toBe("B");
        });
        it("should Mixin.getArgs with optional parameters", () => {
            let baz = new Baz();
            let bizzle = Bizzle.factory(baz, "A");
            expect(bizzle.baz).toBe(baz);
            expect(bizzle.a).toBe("A");
            expect(bizzle.b).toBe("optional");
        });
        it("should Mixin.getArgs with missing required parameters", () => {
            expect(() => {
                let baz = new Baz();
                let bizzle = Bizzle.factory(baz);
            }).toThrowError("Required parameter #2 'a' of type 'String' was not supplied");
        });
        it("should Mixin.getArgs with optional value not matching data type", () => {
            expect(() => {
                let baz = new Baz();
                let bizzle = Bizzle.factory(baz, "A", 0);
            }).toThrowError("Named parameter 'b=0' of type 'Number' was expected to be of type 'String'");
        });
        it("should Mixin.getArgs with missing args", () => {
            expect(() => {
                let baz = new Baz();
                let bizzle = Bizzle.factory();
            }).toThrowError("Required parameter #1 'baz' of type 'Baz' was not supplied");
        });
        it("should Mixin.getArgs named parameters", () => {
            let baz = new Baz();
            let bizzle = Bizzle.factory({ baz, a: "A", b: "B" });
            expect(bizzle.baz).toBe(baz);
            expect(bizzle.a).toBe("A");
            expect(bizzle.b).toBe("B");
        });
        it("should Mixin.getArgs named parameters with optional", () => {
            let baz = new Baz();
            let bizzle = Bizzle.factory({ baz, a: "A" });
            expect(bizzle.baz).toBe(baz);
            expect(bizzle.a).toBe("A");
            expect(bizzle.b).toBe("optional");
        });
        it("should Mixin.getArgs named parameters with missing required", () => {
            expect(() => {
                let baz = new Baz();
                let bizzle = Bizzle.factory({ baz });
            }).toThrowError("Required parameter #2 'a' of type 'String' was not supplied");
        });
    });
});

