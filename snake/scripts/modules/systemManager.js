import * as systems from "./systems/systems.js";

export class SystemManager {
    /** @type{object} */
    #systems;

    constructor(/** @type{HTMLDivElement} */root) {
        this.#systems = {};
    }
    loadSystems() {
        for (const system of Object.values(systems)) {
            if (typeof system !== "function") continue;
            const sys = new system(root);
            sys.init();
            this.#systems[sys.type] = sys;
        }
    }
    /** @returns{systems.AudioSystem} */
    getAudio() {
        return this.#systems["audio"];
    }

    /** @returns{systems.ConfigSystem} */
    getConfig() {
        return this.#systems["config"];
    }

    /** @returns{systems.SpawnSystem} */
    getSpawn() {
        return this.#systems["spawn"];
    }
}