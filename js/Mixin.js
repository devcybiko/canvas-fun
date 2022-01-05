class Mixin {
    constructor(args) {
        // this._checkArgs_(args, "USE THE FACTORY METHOD");
        if (args !== null) throw Error("USE THE FACTORY METHOD");
        this._mixin_();
    }
    static factory(args) {
        let clazz = this;
        let obj = new clazz(null);
        if (obj._init === undefined) throw Error("Mixin classes need an _init() method");
        obj._init(...arguments);
        return Mixin.seal(obj);
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
    // static constructorProxy = {
    //     construct: function (target, args) {
    //         let obj = new target(...args);
    //         obj._sealed_ = true;
    //         return new Proxy(obj, Mixin.accessorProxy);
    //     }
    // };
    static _assignArgument(newargs, i, name, arg, defaultValue) {
        // overlay the positional parameters on the default values
        let t2 = defaultValue.prototype ? defaultValue.prototype.constructor.name : defaultValue.constructor.name;
        if (arg === undefined) {
            if (typeof defaultValue === "function") {
                // a datatype was passed as a required paramter (the class was specified)
                return `Required parameter #${i + 1} '${name}' of type '${t2}' was not supplied`;
            }
            arg = defaultValue; // it had a default value
        }
        newargs[name] = arg;
        let t1 = newargs[name].prototype ? newargs[name].prototype.constructor.name : newargs[name].constructor.name;
        if (t2 !== 'undefined' && t1 !== t2) {
            // the provided value either was a default, or it didn't match the type of the default value
            return `Named parameter '${name}=${arg}' of type '${t1}' was expected to be of type '${t2}'`;
        }
    }
    static getArgs(args, defaults) {
        // to make optional & typed, defaults = {parmname: "defaultvalue"}
        // to make required, defaults = {parmname: undefined}
        let newargs = { _args_: true };
        let errors = [];
        let defaultNames = Object.keys(defaults);
        if (args.length === 1 && args[0].constructor.name === 'Object') {
            // they passed a hash of named arguments
            args = args[0] || {};
            let i = 0;
            for (let name of defaultNames) {
                let arg = args[name];
                let defaultValue = defaults[name];
                let error = this._assignArgument(newargs, i, name, arg, defaultValue);
                if (error) errors.push(error);
                i++;
            }
            for (let name of Object.keys(args)) {
                if (defaultNames.includes(name)) continue;
                errors.push("Argument list has unexpected parameter: " + name);
            }
        }
        else {
            // it appears to be a set of positional parameters
            for (let i = 0; i < defaultNames.length; i++) {
                // overlay the positional parameters on the default values
                let name = defaultNames[i];
                let arg = args[i];
                let defaultValue = defaults[name];
                let error = this._assignArgument(newargs, i, name, arg, defaultValue);
                if (error) errors.push(error);
            }
        }
        if (errors.length) throw Error("\n" + errors.join("\n"));
        return Mixin.seal(newargs);
    }
    static seal(obj) {
        obj._sealed_ = true;
        let proxy = new Proxy(obj, Mixin.accessorProxy);
        return proxy;
    }
    static mixin(_mixers, force = false) {
        this._initializers = this._initializers || [];
        for(let name of Object.keys(_mixers)) {
            let functions = _mixers[name];
            for(let fnName of Object.keys(functions)) {
                if (this.prototype[fnName] && !force) throw new Error("ERROR - {" + name + "} - already has a method '" + fnName + "()'");
            }
            let initializer = functions[name];
            if (typeof initializer !== "function") throw new Error("ERROR - {" + name + "} - should have a init function '" + name + "()'");
            this._initializers.push(initializer);
            Object.assign(this.prototype, functions);
        }
    }
    _mixin_() {
        let initializers = this.constructor._initializers || [];
        for (let initializer of initializers) {
            initializer.bind(this);
            initializer();
        }
    }
    // _checkArgs_(args, msg) {
    //     if (!args._args_) throw Error(msg || "BAD ARGS: These args should pass through 'Mixin.getArgs()'");
    // }
}

if (module) {
    module.exports = Mixin;
}