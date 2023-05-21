export class Entity {
    SQUARE_SIZE = 0.1;

    /** @type{number} */
    #x;
    /** @type{number} */
    #y;

    /** @returns{number} */
    getX() {
        return this.#x;
    }
    /** @returns{number} */
    getY() {
        return this.#y;
    }

    setX(/** @type{number} */x) {
        this.#x = x;
    }
    setY(/** @type{number} */y) {
        this.#y = y;
    }

    shiftX(/** @type{number} */x) {
        this.#x += x;
    }
    shiftY(/** @type{number} */y) {
        this.#y += y;
    }

}