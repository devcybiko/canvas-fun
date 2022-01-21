const LoggingMixin = {
    LoggingMixin() {
    },
    log(args) {
        console.log("LoggingMixin::log", ...arguments);
    }
}
