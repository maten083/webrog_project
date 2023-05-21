import {BaseSystem} from "./baseSystem.js";

/**
 * @readonly
 * @enum {number}
 */
const ControlKeys = {
    /** @type{number} */
    UP: 0,
    /** @type{number} */
    DOWN: 1,
    /** @type{number} */
    LEFT: 2,
    /** @type{number} */
    RIGHT: 3,
    /** @type{number} */
    CONFIRM: 4,
    /** @type{number} */
    CANCEL: 5
}
export class ConfigSystem extends BaseSystem {
    #keymap;

    constructor(/** @type{HTMLDivElement} */root) {
        super("config", root)

        this.#keymap = {};
    }

    init() {
        let items = localStorage.getItem("snake_keymap");
        if (!items) {
            this.#keymap = {
                [ControlKeys.UP]: 'KeyW',
                [ControlKeys.DOWN]: 'KeyS',
                [ControlKeys.LEFT]: 'KeyA',
                [ControlKeys.RIGHT]: 'KeyD',
                [ControlKeys.CONFIRM]: 'Enter',
                [ControlKeys.CANCEL]: 'Escape',
            };
        } else {
            this.#keymap = JSON.parse(items);
        }
    }

    /** @returns(string) */
    getKey(/** @type{ControlKeys} */ key) {
        return this.#keymap[key];
    }

    /**
     * resolves when a new key has been set;
     * rejects when it was cancelled
     * @returns(Promise)
     */
    registerKey(/** @type{HTMLCanvasElement} */ canvas, /** @type{ControlKeys} */ key) {
        return new Promise((resolve, _) => {
            const regKey = function(/** @type{KeyboardEvent}*/e) {
                this.#keymap[key] = e.key;
                canvas.removeEventListener("keydown", regKey);

                resolve();
            }.bind(this);
            canvas.addEventListener("keydown", regKey);
        })
    }
}
export { ControlKeys }