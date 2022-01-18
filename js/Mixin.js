if (typeof module !== 'undefined')  var {_log,_error,_between,_random,_classOf,_classesOf,_instanceOf,_isClass} = require('../js/utils.js');
class Lambda {
}
class Mixin {
    constructor(args) {
        if (args !== null) throw Error("USE THE FACTORY METHOD");
        this._init_();
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
            if (name !== 'prototype' && !Reflect.has(target, name)) throw Error("No such property: " + name);
            return Reflect.get(target, name);
        },
        set: function (target, name, value) {
            if (target._sealed_ && !Reflect.has(target, name)) throw Error("Cannot create a new property: " + name);
            return Reflect.set(target, name, value);
        }
    };
    static _assignArgument(errors, newargs, i, name, arg, defaultValue) {
        let defaultClass = _classOf(defaultValue);
        if (_isClass(defaultValue)) { // required value
            if (arg === undefined && defaultClass !== "Lambda") errors.push(`Required parameter #${i + 1} '${name}' of type '${defaultClass}' was not supplied`);
            if (!_instanceOf(arg, defaultClass) && defaultClass !== "Lambda") errors.push(`Required parameter #${i + 1} '${name}' of type '${defaultClass}' did not match ${arg} of type ${_classOf(arg)}`);
        } else { // default value supplied
            if (arg === undefined) arg = defaultValue;
            if (!_instanceOf(arg, defaultClass)) errors.push(`Positional parameter #${i + 1} '${name}=${arg}' of type ${_classOf(arg)} did not match default value '${defaultValue}' of type ${defaultClass}`);
        }
        newargs[name] = arg;
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
                if (defaults[name] === undefined) throw new Error(`ERROR - default value of '${name}' needs to be a constant or a Class`);
                this._assignArgument(errors, newargs, i, name, arg, defaults[name]);
                i++;
            }
            for (let name of Object.keys(args)) {
                if (!defaultNames.includes(name)) errors.push("Argument list has unexpected parameter: " + name);
            }
        }
        else {
            // it appears to be a set of positional parameters
            let i = 0;
            for (let name of defaultNames) {
                let arg = args[i];
                if (defaults[name] === undefined) throw new Error(`ERROR - default value of '${name}' needs to be a constant or a Class`);
                this._assignArgument(errors, newargs, i, name, arg, defaults[name]);
                i++;
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
            for(let fnName of Object.keys(_mixers[name])) {
                if (this.prototype[fnName] && !force) throw new Error("ERROR - {" + name + "} - already has a method '" + fnName + "()'");
            }
            let initializer = _mixers[name][name];
            if (typeof initializer !== "function") throw new Error("ERROR - {" + name + "} - should have a init function '" + name + "()'");
            this._initializers.push(initializer);
            Object.assign(this.prototype, _mixers[name]);
        }
    }
    _init_() {
        for (let initializer of  this.constructor._initializers || []) {
            initializer.bind(this);
            initializer();
        }
    }
}
if (typeof module !== 'undefined') module.exports = Mixin;