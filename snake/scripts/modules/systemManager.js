import * as systems from "./systems/systems.js";

export class SystemManager {
    /** @type{object} */
    #systems;

    constructor() {
        this.#systems = {};
    }

    /**
     * Load all systems dynamically
     * @param {HTMLDivElement} root
     * @param {SnakeGame} snakeGame
     */
    loadSystems(root, snakeGame) {
        for (const system of Object.values(systems)) {
            if (typeof system !== "function") continue;
            const sys = new system(root, snakeGame);
            sys.init();
            this.#systems[sys.type] = sys;
        }
    }

    /**
     * Updates all systems
     * @param {number} delta
     * @param {boolean} paused
     *
     * @returns {boolean} The result of EntitySystem: true if dead
     */
    updateSystems(delta, paused) {
        let result = false;
        for (const system of Object.values(this.#systems)) {
            if (system.type === 'entity')
                result = system.update(delta, paused);
            else system.update(delta, paused);
        }
        return result;
    }
    /** @returns{systems.AudioSystem} */
    getAudio() {
        return this.#systems["audio"];
    }

    /** @returns{systems.ConfigSystem} */
    getConfig() {
        return this.#systems["config"];
    }

    /** @returns{systems.EntitySystem} */
    getEntity() {
        return this.#systems["entity"];
    }

    /** @returns{systems.GenericInputSystem} */
    getGenericInput() {
        return this.#systems['genericInput'];
    }
}