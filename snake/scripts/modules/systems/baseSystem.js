export class BaseSystem {
    /** @type{HTMLDivElement} */
    root;
    /** @type{string} */
    type;

    constructor(/** @type{string} */type, /** @type{HTMLDivElement} */root) {
        this.root = root;
        this.type = type;
    }
    /**
     * Implementation required
     */
    init() {
        throw new Error("Init method was not implemented in the subsystem");
    }
}