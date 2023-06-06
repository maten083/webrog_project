import { Entity } from "./entity.js";

export class Snake extends Entity {
    constructor(x, y, direction) {
        super(x, y, direction);
        this.addSegment(x - this.getScale() * 2, y)
    }
    /**
     * Sets the direction
     *
     * @param {Direction} direction
     */
    setDirection(direction) {
        const segments = this.getSegments();
        segments[0].setDirection(direction);
    }
}