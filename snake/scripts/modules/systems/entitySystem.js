import {BaseSystem} from "./baseSystem.js";
import {SnakeGame} from "../../snakeGame.js";
import {ControlKeys} from "./configSystem.js";
import {Direction} from "../../entities/entity.js";

export class EntitySystem extends BaseSystem {
    /**
     * @param {HTMLDivElement} root
     * @param {SnakeGame} snakeGame
     */
    constructor(root, snakeGame) {
        super("entity", root, snakeGame);
    }

    init() {
        const config = this.snakeGame.getSystemManager().getConfig();
        this.snakeGame.getCanvas().addEventListener("keydown", e => {
            switch (e.code) {
                case config.getKey(ControlKeys.UP):
                    this.snakeGame.getSnake().setDirection(Direction.UP);
                    break;
                case config.getKey(ControlKeys.DOWN):
                    this.snakeGame.getSnake().setDirection(Direction.DOWN);
                    break;
                case config.getKey(ControlKeys.LEFT):
                    this.snakeGame.getSnake().setDirection(Direction.LEFT);
                    break;
                case config.getKey(ControlKeys.RIGHT):
                    this.snakeGame.getSnake().setDirection(Direction.RIGHT);
                    break;
            }
        });
    }

    update(delta) {
        this.snakeGame.getSnake().update(delta);
        this.snakeGame.getApple().update(delta);
    }
}