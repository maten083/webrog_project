import {BaseSystem} from "./baseSystem.js";
import {SnakeGame} from "../../snakeGame.js";
import {ControlKeys} from "./configSystem.js";

export class GenericInputSystem extends BaseSystem {
    /**
     * @param {HTMLDivElement} root
     * @param {SnakeGame} snakeGame
     */
    constructor(root, snakeGame) {
        super("genericInput", root, snakeGame);
    }

    init() {
        const config = this.snakeGame.getSystemManager().getConfig();
        this.snakeGame.getCanvas().addEventListener("keydown", e => {
            const game = this.snakeGame;
            switch (e.code) {
                case config.getKey(ControlKeys.PAUSE):
                    game.togglePaused();
                    break;
            }
        });
    }
}