import {Direction} from "../entity.js";
import {SnakeGame} from "../../snakeGame.js";
import {Matrix4f} from "../../math/matrix4f.js";

export class Segment {
    /** @type{Entity} */#entity;
    /** @type{number} */#x;
    /** @type{number} */#y;
    /** @type{Direction} */#direction;

    /** @type{Array.<{x: Number, y: Number, direction: Direction}>} */ #turningPoints;

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
        this.#turningPoints = [];
        this.#matrix = Matrix4f.identity();
        this.#segmentIndex = entity.getSegments().length;
    }

    /**
     * @param {number} delta
     */
    update(delta) {
        switch (this.#direction) {
            case Direction.NONE:
                break;
            case Direction.RIGHT:
                this.shift(SnakeGame.variables.SPEED * delta, 0);

                if (this.#turningPoints.length > 0 && this.#x >= this.#turningPoints[0].x) {
                    this.#direction = this.#turningPoints[0].direction;
                    this.#turningPoints.shift();
                }
                break;
            case Direction.LEFT:
                this.shift((-SnakeGame.variables.SPEED) * delta, 0);

                if (this.#turningPoints.length > 0 && this.#x <= this.#turningPoints[0].x) {
                    this.#direction = this.#turningPoints[0].direction;
                    this.#turningPoints.shift();
                }
                break;
            case Direction.UP:
                this.shift(0, SnakeGame.variables.SPEED * delta);

                if (this.#turningPoints.length > 0 && this.#y >= this.#turningPoints[0].y) {
                    this.#direction = this.#turningPoints[0].direction;
                    this.#turningPoints.shift();
                }
                break;
            case Direction.DOWN:
                this.shift(0, (-SnakeGame.variables.SPEED) * delta);

                if (this.#turningPoints.length > 0 && this.#y <= this.#turningPoints[0].y) {
                    this.#direction = this.#turningPoints[0].direction;
                    this.#turningPoints.shift();
                }
                break;
        }

        let rot = 0;
        // Direction might have been updated
        switch (this.#direction) {
            case Direction.UP:
                rot = 180 * (Math.PI / 180);
                break;
            case Direction.LEFT:
                rot = 90 * (Math.PI / 180);
                break;
            case Direction.RIGHT:
                rot = 270 * (Math.PI / 180);
                break;
        }
        this.#matrix.translate(this.#x, this.#y, rot, this.#entity.getScale())
    }

    /**
     * Get all turning points
     * @returns {Array<{x: Number, y: Number, direction: Direction}>}
     */
    getTurningPoints() {
        return this.#turningPoints;
    }

    /**
     * Add a turning point
     * @param {number} x
     * @param {number} y
     * @param {Direction} direction
     */
    addTurningPoint(x, y, direction) {
        this.#turningPoints.push({
            x, y, direction
        })
    }

    getTransformationMatrix() {
        return this.#matrix;
    }

    /**
     * Get the texture of the segment
     * @returns {WebGLTexture}
     */
    getTexture() {
        if (this.#entity.isInvariantTextures()) return this.#entity.getFirstTexture();

        if (this.#segmentIndex === 0) return this.#entity.getFirstTexture();
        if (this.#segmentIndex === this.#entity.getTextures().length - 1) return this.#entity.getLastTexture();

        return this.#entity.getMiddleTexture();
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
}