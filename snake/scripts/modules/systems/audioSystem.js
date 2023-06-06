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
    /**
     * @type {Array.<{path: string, title: string}>}
     */
    #availableMusics;
    /**
     * @type {Map<number, HTMLAudioElement>}
     */
    #audioBank;

    /**
     * @type {ConfigSystem|null}
     */
    #config = null;

    /**
     * @param {HTMLDivElement} root
     * @param {SnakeGame} snakeGame
     */
    constructor(root, snakeGame) {
        super("audio", root, snakeGame);
        this.#audioBank = new Map();
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
    }

    init() {
        // 'i' exactly maps AudioKeys.MUSIC[id]
        for (let i = 0; i < this.#availableMusics.length; i++) {
            this.#audioBank.set(i, this.#createAudio(this.#availableMusics[i].path));
            this.#audioBank.get(i).loop = true;
        }

        this.#audioBank.set(AudioKeys.APPLE, this.#createAudio('assets/sfx/apple.wav'));
        this.#audioBank.set(AudioKeys.SUPER_APPLE, this.#createAudio('assets/sfx/super_apple.wav'));
        this.#audioBank.set(AudioKeys.FAIL, this.#createAudio('assets/sfx/fail.wav'));
        this.root.addEventListener("config_changed", e => {
            /** @type {{previous: AudioKeys, current: AudioKeys, type: string}|undefined} */
            const details = e.detail;
            if (details && details.type === "selectedMusic") {
                this.get(details.previous).pause();
                this.get(details.previous).currentTime = 0;

                if (!this.snakeGame.isPaused())
                    this.playBackgroundMusic();
            }
        })
    }

    /**
     * @param {AudioKeys} key
     * @returns {HTMLAudioElement}
     */
    get(key) {
        return this.#audioBank.get(key);
    }

    /**
     * Gets all the available background musics
     * @returns {Array<{path: string, title: string}>}
     */
    getAvailableMusics() {
        return this.#availableMusics;
    }

    pauseBackgroundMusic() {
        this.#getConfig();
        this.get(this.#config.getSelectedMusic()).pause();
    }
    playBackgroundMusic() {
        this.#getConfig();

        this.get(this.#config.getSelectedMusic()).play();
    }

    #createAudio(path) {
        const elem = document.createElement("audio");
        elem.src = path;
        this.root.insertAdjacentElement("beforeend", elem);
        return elem;
    }
    #getConfig() {
        if (this.#config === null) this.#config = this.snakeGame.getSystemManager().getConfig();
        return this.#config;
    }
}

export { AudioKeys }