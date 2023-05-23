import {BaseSystem} from "./baseSystem.js";

/**
 * @readonly
 * @enum {number}
 */
const AudioKeys = {
    /** @type{number} */
    MUSIC1: 0,
    /** @type{number} */
    MUSIC2: 1,
    /** @type{number} */
    APPLE: 2,
    /** @type{number} */
    SUPER_APPLE: 3,
    /** @type{number} */
    FAIL: 4
}

export class AudioSystem extends BaseSystem {
    #availableMusics;
    #audioBank;

    /**
     * @param {HTMLDivElement} root
     * @param {SnakeGame} snakeGame
     */
    constructor(root, snakeGame) {
        super("audio", root, snakeGame);
        this.#audioBank = {};
        this.#availableMusics = [
            {
                path: 'assets/music/bg1.ogg',
                title: 'Rinne - Awaken'
            },
            {
                path: 'assets/music/bg2.ogg',
                title: 'ミツキヨ - 時の招かれざる客'
            }
        ]
        console.log(this.#availableMusics);
    }

    init() {
        // 'i' perfectly maps AudioKeys.MUSIC[id]
        for (let i = 0; i < this.#availableMusics.length; i++) {
            this.#audioBank[i] = this.#createAudio(this.#availableMusics[i].path);
        }

        this.#audioBank[AudioKeys.APPLE] = this.#createAudio('assets/sfx/apple.wav');
        this.#audioBank[AudioKeys.SUPER_APPLE] = this.#createAudio('assets/sfx/super_apple.wav');
        this.#audioBank[AudioKeys.FAIL] = this.#createAudio('assets/sfx/fail.wav');
    }

    /**
     * @param {AudioKeys} key
     * @returns {HTMLAudioElement}
     */
    get(key) {
        return this.#audioBank[key];
    }

    #createAudio(path) {
        const elem = document.createElement("audio");
        elem.src = path;
        this.root.insertAdjacentElement("beforeend", elem);
        return elem;
    }
}

export { AudioKeys }