import {Direction} from "../entity.js";
import {SnakeGame} from "../../snakeGame.js";
import {Matrix4f} from "../../math/matrix4f.js";

export class Segment {
    /** @type{Entity} */#entity;
    /** @type{number} */#x;
    /** @type{number} */#y;
    /** @type{Direction} */#direction;

    /** @type{Matrix4f} */#matrix;

    /** @type{number} */#segmentIndex;

    /**
     * @param {Entity} entity
     * @param {number} x
     * @param {number} y
     * @param {Direction} direction
     */
    constructor(entity, x = 0, y = 0, direction = Direction.NONE) {
        this.#entity = entity;
        this.#x = x;
        this.#y = y;
        this.#direction = direction;
        this.#matrix = Matrix4f.identity();
        this.#segmentIndex = entity.getSegments().length;
    }

    duplicate(xOffset, yOffset) {
        const dupe = new Segment(this.#entity,
            this.#x + xOffset,
            this.#y + yOffset,
            this.#direction);

        dupe.update(0, true, this);

        return dupe;
    }

    /**
     * @param {number} delta
     * @param {boolean} updatePosition
     * @param {Segment|null} previousSegment
     *
     * @returns {number} the distance that this segment was updated with
     */
    update(delta, updatePosition, previousSegment = null) {
        if (previousSegment !== null) {
            [ this.#x, this.#y ] = this.calculatePosition(previousSegment);
        } else if (updatePosition) {
            let distance = SnakeGame.variables.SPEED * delta;

            const update = () => {
                switch (this.#direction) {
                    case Direction.NONE:
                        break;
                    case Direction.RIGHT:
                        this.shift(distance, 0);
                        break;
                    case Direction.LEFT:
                        this.shift(-distance, 0);
                        break;
                    case Direction.UP:
                        this.shift(0, distance);
                        break;
                    case Direction.DOWN:
                        this.shift(0, -distance);
                        break;
                }
            }
            update();
        }

        this.#updateMatrix();
    }

    /**
     * @param {Segment} precedingSegment
     */
    calculatePosition(precedingSegment) {
        const precedingX = precedingSegment.getX();
        const precedingY = precedingSegment.getY();
        const thisX = this.#x;
        const thisY = this.#y;

        let xDiff = thisX - precedingX;
        let yDiff = thisY - precedingY;

        const currentDistance = Math.sqrt(
            Math.pow(xDiff, 2)
            + Math.pow(yDiff, 2)
        );
        const targetDistance = this.#entity.getScale(true) * 2
        const distance = targetDistance - currentDistance;

        const angle = Math.atan2(yDiff, xDiff);

        return [ thisX + distance * Math.cos(angle), thisY + distance * Math.sin(angle) ];
    }
    /**
     * Check for intersection with another segment
     * @param {Segment} segment
     * @param {number} offset
     */
    doesIntersect(segment, offset = 0) {
        const distance = Math.sqrt(
            Math.pow(this.#x - segment.#x, 2)
            + Math.pow(this.#y - segment.#y, 2));

        const radius1 = this.#entity.getScale();
        const radius2 = segment.#entity.getScale();

        return distance + offset <= radius1 + radius2;
    }

    getTransformationMatrix() {
        return this.#matrix;
    }

    /**
     * Shifts the coordinates of the current segment by x and y
     * @param {number} x
     * @param {number} y
     */
    shift(x, y) {
        this.#x += x;
        this.#y += y;
    }

    /**
     * Gets the X coordinate
     * @returns {number}
     */
    getX() { return this.#x; }
    /**
     * Sets the X value
     * @param {number} value
     */
    setX(value) { this.#x = value; }

    /**
     * Gets the direction of the current segment
     * @returns {Direction}
     */
    getDirection() { return this.#direction; }

    /**
     * Sets the direction of the current segment
     * @param {Direction} direction
     */
    setDirection(direction) { this.#direction = direction; }

    /**
     * Gets the Y coordinate
     * @returns {number}
     */
    getY() { return this.#y; }
    /**
     * Sets the Y value
     * @param {number} value
     */
    setY(value) { this.#y = value; }

    /**
     * Gets the [x,y] coordinates
     *
     * @returns {number[]}
     */
    getCoordinates() { return [ this.#x, this.#y ]; };

    #updateMatrix() {
        this.#matrix.translate(this.#x, this.#y, 0, this.#entity.getScale());
    }
}