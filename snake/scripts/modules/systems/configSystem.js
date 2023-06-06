import {BaseSystem} from "./baseSystem.js";
import {AudioKeys} from "./audioSystem.js";

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
    CANCEL: 5,
    /** @type{number} */
    PAUSE: 6
}
export class ConfigSystem extends BaseSystem {
    /** @type{string[]} */ #excludedValues;
    /** @type{CustomEvent} */ #cancelEvent;
    /** @type{string} */ #configChanged;

    /** @type{object} */ keymap;
    /** @type{number} */ fps = 120;

    /** @type{AudioKeys} */ selectedMusic = AudioKeys.MUSIC1;

    /** @type{ControlKeys|null} */ recording;

    /**
     * Initialize config system
     * @param {HTMLDivElement} root
     * @param {SnakeGame} snakeGame
     */
    constructor(root, snakeGame) {
        super("config", root, snakeGame)

        this.keymap = {};
        this.#excludedValues = [
            '#excludedValues',
            '#cancelEvent',
            '#configChanged',
            'root',
            'type',
            'recording'
        ]
        this.#cancelEvent = new CustomEvent("cancel_record");
        this.#configChanged = "config_changed";
    }

    /**
     * Load config from LocalStorage
     */
    init() {
        let configJson = localStorage.getItem("snake_config");
        this.keymap = {
            [ControlKeys.UP]: 'KeyW',
            [ControlKeys.DOWN]: 'KeyS',
            [ControlKeys.LEFT]: 'KeyA',
            [ControlKeys.RIGHT]: 'KeyD',
            [ControlKeys.PAUSE]: 'Space',
            [ControlKeys.CONFIRM]: 'Enter',
            [ControlKeys.CANCEL]: 'Escape',
        };

        if (!configJson) {
            this.save();
        }
        else {
            const config = JSON.parse(configJson);
            // Ensure that config entries that are not present in the LocalStorage aren't lost.
            Object.assign(this.keymap, config.keymap);
            config.keymap = this.keymap;

            // Assign rest of the values
            Object.assign(this, config);
        }
    }

    getFps() {
        return this.fps;
    }
    setFps(fps) {
        this.fps = fps;
        this.root.dispatchEvent(new CustomEvent(this.#configChanged, { detail: { type: 'fps' } }));
        this.save();
    }

    getSelectedMusic() {
        return this.selectedMusic;
    }

    /**
     * Set the selected music
     * @param {number|AudioKeys} key
     */
    setSelectedMusic(key) {
        const previous = this.selectedMusic;
        this.selectedMusic = key;
        this.root.dispatchEvent(new CustomEvent(this.#configChanged, {
            detail: {
                type: 'selectedMusic',
                previous: previous,
                current: key
            }
        }));
        this.save();
    }

    /**
     * Cancels the current key recording.
     */
    cancel() {
        this.root.dispatchEvent(this.#cancelEvent);
    }

    /**
     * Save current config to LocalStorage
     */
    save() {
        const entries = Object.entries(this);
        const object = {};
        for (const entry of entries) {
            if (!this.#excludedValues.includes(entry[0])) {
                object[entry[0]] = entry[1]
            }
        }
        localStorage.setItem("snake_config", JSON.stringify(object));
    }

    /**
     * Get a keycode for a specific action
     * @param {ControlKeys} key
     * @returns {string} The keycode, like KeyA
     */
    getKey(key) {
        return this.keymap[key];
    }

    /**
     * Records a key. Resolves when a new key has been set; rejects when it was cancelled
     * @param {HTMLCanvasElement} canvas
     * @param {ControlKeys} key
     * @returns {Promise<void>}
     */
    registerKey(canvas, key) {
        return new Promise((resolve, reject) => {
            this.recording = key;
            canvas.addEventListener("keydown", this.#innerRegisterKey.bind(this, key, canvas, resolve));

            const cancel = function() {
                this.root.removeEventListener('cancel_record', cancel);
                canvas.removeEventListener("keydown", this.#innerRegisterKey);
                this.recording = null;
                reject();
            }.bind(this);
            this.root.addEventListener('cancel_record', cancel)
        })
    }

    /**
     * Parameter 'e' is populated by the event listener
     * @param {ControlKeys} key
     * @param {HTMLCanvasElement} canvas
     * @param {function} resolve
     * @param {KeyboardEvent} e
     */
    #innerRegisterKey(key, canvas, resolve, e) {
        this.keymap[key] = e.key;
        canvas.removeEventListener("keydown", this.#innerRegisterKey);
        this.root.dispatchEvent(new CustomEvent(this.#configChanged, { detail: { type: 'key' }}));
        this.recording = null;
        this.save();
        resolve();
    }
}
export { ControlKeys }