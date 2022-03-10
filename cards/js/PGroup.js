class PGroup extends PObject {
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        super(args);
    }
    _init(args) {
        super._init(args);
        this._addAgent(PAgentClickable.factory());
        return this;
    }
}
