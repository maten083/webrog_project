import {Segment} from "./baseEntitites/segment.js";
import {SnakeGame} from "../snakeGame.js";

/**
 * @readonly
 * @enum {Direction}
 */
const Direction = {
    NONE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
}
export class Entity {
    /** @type {Segment[]} */ #segments;

    /** @type {WebGLTexture} */ #firstTexture;
    /** @type {WebGLTexture} */ #middleTexture;
    /** @type {WebGLTexture} */ #lastTexture;

    /** @type {number} */#scale = 0.04;

    /**
     * @param {number} x
     * @param {number} y
     * @param {Direction} direction
     */
    constructor(x = 0, y = 0, direction = Direction.RIGHT) {
        this.#segments = [];
        this.#segments.push(new Segment(this, x, y, direction));
    }

    addSegment(x, y) {
        const last = this.#segments[this.#segments.length - 1];
        const newSegment = new Segment(this, x, y, last.getDirection());
        this.#segments.push(newSegment);
    }
    duplicateLastSegment() {
        const last = this.#segments[this.#segments.length - 1];
        let xOffset = 0;
        let yOffset = 0;

        switch (this.getCurrentDirection()) {
            case Direction.UP:
                xOffset = 1;
                yOffset = 1;
                break;
            case Direction.DOWN:
                xOffset = -1;
                yOffset = -1;
                break;
            case Direction.LEFT:
                xOffset = 1;
                yOffset = -1;
                break;
            case Direction.RIGHT:
                xOffset = -1;
                yOffset = -1;
                break;
        }

        const dupe = last.duplicate(xOffset, yOffset);
        this.#segments.push(dupe)
    }
    /**
     * Get the direction of the first segment
     * @returns {Direction}
     */
    getCurrentDirection() {
        return this.#segments[0].getDirection();
    }

    /**
     * Get the scale of the entity;
     *
     * @param {boolean} useDefaultScale - Whether to use SCALE or DEFAULT_SCALE variable.
     *
     * @returns {number}
     */
    getScale(useDefaultScale = false) {
        return this.#scale * (useDefaultScale ? SnakeGame.variables.DEFAULT_SCALE : SnakeGame.variables.SCALE);
    }

    /**
     * Update entity and its segments
     *
     * @param {number} delta
     * @param {boolean} updatePosition
     *
     * @returns {boolean[]} - first is the main state, second is the secondary state (for apple)
     */
    update(delta, updatePosition) {
        this.#segments[0].update(delta, updatePosition);
        for (let i = 1; i < this.#segments.length; i++) {
            this.#segments[i].update(delta, updatePosition, this.#segments[i - 1])

            if (updatePosition) {
                if (i !== 0 && this.#segments[0].doesIntersect(this.#segments[i], 0.04)) {
                    return [ true, false ];
                }
            }
        }
        return [ this.#segments[0].getX() > 1 || this.#segments[0].getX() < -1
            || this.#segments[0].getY() > 1 || this.#segments[0].getY() < -1, false ];
    }

    isInvariantTextures() {
        return this.#firstTexture === this.#middleTexture && this.#firstTexture === this.#lastTexture;
    }
    /**
     * Sets all textures for the entity
     *
     * @param {WebGLTexture} first
     * @param {WebGLTexture|null} [middle]
     * @param {WebGLTexture|null} [last]
     */
    setTextures(first, middle = null, last = null) {
        this.#firstTexture = first;

        if (middle !== null)
            this.#middleTexture = middle;
        else
            this.#middleTexture = first;

        if (last !== null)
            this.#lastTexture = last;
        else
            this.#lastTexture = first;
    }

    /**
     * Gets the first texture
     * @returns {WebGLTexture}
     */
    getFirstTexture() {
        return this.#firstTexture;
    }

    /**
     * Gets the middle texture
     * @returns {WebGLTexture}
     */
    getMiddleTexture() {
        return this.#middleTexture;
    }

    /**
     * Gets the last texture
     * @returns {WebGLTexture}
     */
    getLastTexture() {
        return this.#lastTexture;
    }

    /**
     * Gets all textures
     * @returns {WebGLTexture[]}
     */
    getTextures() {
        return [
            this.#firstTexture,
            this.#middleTexture,
            this.#lastTexture
        ]
    }

    /**
     * Returns the segments of this entity
     * @returns {Segment[]}
     */
    getSegments() { return this.#segments; }
}

export { Direction }