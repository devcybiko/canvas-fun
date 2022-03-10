class PDraggable extends PAgent{
    static factory(args) {
        return (new this(args))._init(args);
    }
    constructor(args) {
        super(args);
    }
    _init(args) {
        this._.obj = args.obj;
        this._.startX = 0;
        this._.startY = 0;
        this._.origX = 0;
        this._.origY = 0;
        this._.dx = 0
        this._.dy = 0;
        this._.isDragging = 0;
        return super._init(args);
    }
    handle(eventType, x, y, event) {
        if (eventType === "onClick") return onClick(x, y, event);
        if (eventType === "onMove") return onMove(x, y, event);
        if (eventType === "onClickUp") return onClickUp(x, y, event);
    }
    onClick(x, y, event) {
        let p = this._;
        p.isDragging = true;
        p.dx = x;
        p.dy = y;
        p.startX = event.playfieldX;
        p.startY = event.playfieldY;
        p.origX = p.obj.x;
        p.origY = p.obj.y;
        return true;
    }
    onMove(x,y,event) {
        let p = this._;
        if (!p.isDragging) return;
        dx = event.playfieldX - p.startX;
        dy = event.playfieldY - p.startY;
        p.obj.move(p.origX + dx, p.origY + dy);
    }

}