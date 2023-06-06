import {BaseSystem} from "./baseSystem.js";
import {SnakeGame} from "../../snakeGame.js";
import {ControlKeys} from "./configSystem.js";
import {Direction} from "../../entities/entity.js";
import {AudioKeys} from "./audioSystem.js";

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
            if (this.snakeGame.isPaused())
                return;
            const snake = this.snakeGame.getSnake();
            switch (e.code) {
                case config.getKey(ControlKeys.UP):
                    if (snake.getCurrentDirection() !== Direction.DOWN)
                        snake.setDirection(Direction.UP);
                    break;
                case config.getKey(ControlKeys.DOWN):
                    if (snake.getCurrentDirection() !== Direction.UP)
                        this.snakeGame.getSnake().setDirection(Direction.DOWN);
                    break;
                case config.getKey(ControlKeys.LEFT):
                    if (snake.getCurrentDirection() !== Direction.RIGHT)
                        this.snakeGame.getSnake().setDirection(Direction.LEFT);
                    break;
                case config.getKey(ControlKeys.RIGHT):
                    if (snake.getCurrentDirection() !== Direction.LEFT)
                        this.snakeGame.getSnake().setDirection(Direction.RIGHT);
                    break;
            }
        });
    }

    update(delta, paused) {
        const [ dead] = this.snakeGame.getSnake().update(delta, !paused)
        const [ eaten, wasSuper ] = this.snakeGame.getApple().update(delta, !paused);

        if (eaten) {
            const audio = this.snakeGame.getSystemManager().getAudio();
            this.#stopAudio(audio.get(AudioKeys.SUPER_APPLE))
            this.#stopAudio(audio.get(AudioKeys.APPLE))

            if (wasSuper) {
                audio.get(AudioKeys.SUPER_APPLE).play();
            } else {
                audio.get(AudioKeys.APPLE).play();
            }
        }

        return dead;
    }

    /**
     * Stops the audio source
     *
     * @param {HTMLAudioElement} audio
     */
    #stopAudio(audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}