const Mixin = require('./js/Mixin.js');

class Foo extends Mixin {
    static factory(args) {
        const defaults = {firstname:"Greg", lastname: "Smith", address: "13620 Cradle Hill Road", zip: 23112};
        args = Mixin.getArgs(arguments, defaults);
        console.log("args", args);
        let obj = new this(args);
        return Mixin.seal(obj);
    }
    constructor(args) {
        super();
        Object.assign(this, args);
    }
    getName() {
        return this.firstname;
    }
    setName(name) {
        console.log(...arguments);
        let args = Mixin.getArgs(arguments, {name:"Un-named"});
        this.firstname = args.name;
    }
    log() {
        console.log(this.getName());
    }
}

let obj = Foo.factory("Lora", "Smith");
console.log(obj);
console.assert(obj.firstname === "Lora");
obj.setName("Smith");
obj.log();
try {
    obj.other = "foo";
} catch(er) {
    console.log(er);
}
try {
    console.log(obj["other"]);
} catch(er) {
    console.log(er);
}
console.log(obj);