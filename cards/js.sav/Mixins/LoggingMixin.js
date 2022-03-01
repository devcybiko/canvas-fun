const LoggingMixin = {
    LoggingMixin() {
        this._debug = false;
    },
    setDebug(state) {
        this._debug = state;
    },
    formatError(er, n) {
        let line = er.stack.split("\n")[n];
        let match = line.match(/ +at (.*) [(].*[/](.*):.*[)]/);
        return match[1] + ": " + match[2];
    },
    msg(args) {
        let er = new Error("debug");
        console.log(...arguments, "(at " + this.formatError(er, 2) + ")");
    },
    debug(args) {
        if (this._debug) {
            let er = new Error("debug");
            console.log(...arguments, "(at " + this.formatError(er, 2) + ")");
        }
    },
    error(args) {
        let er = new Error("debug");
        console.error(er, ...arguments);
        if (this.die) this.die(...arguments);
    }
    //die(args) {} // add this method to your class to be called after error(), above
}
