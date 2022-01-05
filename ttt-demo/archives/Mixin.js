class Mixin {
    constructor(args) {
        // this._checkArgs_(args, "USE THE FACTORY METHOD");
        if (args != null) throw Error("USE THE FACTORY METHOD");
        this._mixin_();

    }
    static accessorProxy = {
        get: function (target, name) {
            if (!Reflect.has(target, name)) throw Error("No such property: " + name);
            return Reflect.get(target, name);
        },
        set: function (target, name, value) {
            if (target._sealed_ && !Reflect.has(target, name)) throw Error("Cannot create a new property: " + name);
            return Reflect.set(target, name, value);
        }
    };
    static constructorProxy = {
        construct: function (target, args) {
            let obj = new target(...args);
            obj._sealed_ = true;
            return new Proxy(obj, Mixin.accessorProxy);
        }
    };
    static getArgs(args, defaults) {
        // to make optional & typed, defaults = {parmname: "defaultvalue"}
        // to make required, defaults = {parmname: undefined}
        let newargs = {_args_:true};
        let errors = [];
        let defaultNames = Object.keys(defaults);
        if (args.length === 0 || args.length === 1 && args[0].constructor.name === 'Object') {
            // they passed a hash of named arguments
            args = args[0] || {};
            for (let name of defaultNames) {
                newargs[name] = args[name];
                if (newargs[name] === undefined) {
                    newargs[name] = defaults[name];
                }
                else {
                    let t1 = typeof newargs[name];
                    let t2 = typeof defaults[name];
                    if (t2 !== 'undefined' && t1 !== t2) {
                        errors.push(`Named parameter '${name}=${newargs[name]}' of type '${t1}' was expected to be of type '${t2}'`);
                    }
                }
                if (newargs[name] === undefined) errors.push("Required Parameter missing: " + name);
            }
            for (let name of Object.keys(args)) {
                if (defaultNames.includes(name)) continue;
                errors.push("Argument list has unexpected parameter: " + name);
            }
        }
        else {
            // it appears to be a set of positional parameters
            for (let name of defaultNames) { // populate with defaults
                newargs[name] = defaults[name];
            }
            for (let i = 0; i < args.length; i++) {
                // overlay the positional parameters on the default values
                let name = defaultNames[i];
                let arg = args[i];
                newargs[name] = arg;
                let t1 = typeof newargs[name];
                let t2 = typeof defaults[name];
                if (t2 !== 'undefined' && t1 !== t2) {
                    errors.push(`Named parameter '${name}=${arg}' of type '${t1}' was expected to be of type '${t2}'`);
                }
            }
        }
        if (errors.length) throw Error("\n"+errors.join("\n"));
        return Mixin.seal(newargs);
    }
    static seal(obj) {
        obj._sealed_ = true;
        let proxy = new Proxy(obj, Mixin.accessorProxy);
        return proxy;
    }
    static varToString(varObj) {
        if (typeof varObj !== "object") throw new Error("ERROR - Mixin should be a Dict of functions - {Name}");
        let name = Object.keys(varObj)[0];
        if (typeof name !== "string") throw new Error("ERROR - Mixin should be a Dict of functions - {Name}");
        let dict = varObj[name];
        if (typeof dict !== "object") throw new Error("ERROR - Mixin should be a Dict of functions - {" + name + "}");
        let fn = dict[name];
        if (typeof fn !== "function") throw new Error("ERROR - {" + name + "} - should have a init function '" + name + "(obj)'");
        return name;
    }
    static mixin(_mixer) {
        let name = this.varToString(_mixer);
        let functions = _mixer[name];
        this._initializers = this._initializers || [];
        this._initializers.push(functions[name]);
        Object.assign(this.prototype, functions);
    }
    _mixin_() {
        let initializers = this._initializers || [];
        for (let initializer of initializers) {
            initializer.bind(this);
            initializer(this);
        }
    }
    _checkArgs_(args, msg) {
        if (!args._args_) throw Error(msg || "BAD ARGS: These args should pass through 'Mixin.getArgs()'");
    }
}

//module.exports = Mixin;