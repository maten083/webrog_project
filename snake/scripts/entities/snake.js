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
        for (let i = 1; i < segments.length; i++) {
            segments[i].addTurningPoint(segments[0].getX(), segments[0].getY(), segments[0].getDirection());
        }
    }
}