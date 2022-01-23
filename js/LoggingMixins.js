const LoggingMixin = {
    LoggingMixin() {
        this._debug = false;
    },
    debug(args) {
        if (this._debug) {
            console.log("debug: ", ...arguments);
        }
    }
}
