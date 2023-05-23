import {Segment} from "./baseEntitites/segment.js";

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

    /** @type {number} */#scale = 0.05;

    /**
     * @param {number} x
     * @param {number} y
     * @param {Direction} direction
     */
    constructor(x = 0, y = 0, direction = Direction.RIGHT) {
        this.#segments = [
            new Segment(this, x, y, direction)
        ];
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
     * @returns {number}
     */
    getScale() {
        return this.#scale;
    }

    update(delta) {
        for (const segment of this.#segments) {
            segment.update(delta);
        }
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