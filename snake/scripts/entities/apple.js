import {Direction, Entity} from "./entity.js";
import {SnakeGame} from "../snakeGame.js";

export class Apple extends Entity {
    /** @type{Snake} */#snake;
    /** @type{boolean} */#isSuper;
    /**
     *
     * @param {Snake} snake
     */
    constructor(snake) {
        super(0, 0, Direction.NONE);
        this.#snake = snake;
        this.#setRandomPosition();
    }
    update(delta, updatePosition) {
        super.update(delta, updatePosition);

        if (updatePosition && SnakeGame.variables.SUPER_TIMER !== null) {
            SnakeGame.variables.SUPER_TIMER += delta;

            if (SnakeGame.variables.SUPER_TIMER >= SnakeGame.variables.SUPER_TIMEOUT) {
                SnakeGame.variables.SPEED = SnakeGame.variables.DEFAULT_SPEED;
                SnakeGame.variables.SCALE = SnakeGame.variables.DEFAULT_SCALE;
                SnakeGame.variables.SUPER_TIMER = null;
            }
        }
        if (updatePosition) {
            if (this.getSegments()[0].doesIntersect(this.#snake.getSegments()[0])) {
                this.#snake.duplicateLastSegment();
                const wasSuper = this.#isSuper;
                this.onEaten();
                return [ true, wasSuper ];
            }
        }

        return [ false, false ];
    }

    /* Override invariant texture for rendering */
    isInvariantTextures() {
        return true;
    }

    onEaten() {
        if (this.#isSuper) {
            SnakeGame.variables.SCALE = SnakeGame.variables.SUPER_SCALE;
            SnakeGame.variables.SPEED = SnakeGame.variables.SUPER_SPEED;
            SnakeGame.variables.SUPER_TIMER = 0;
        }
        if (SnakeGame.variables.ALWAYS_SUPER)
            this.#isSuper = true;
        else this.#isSuper = Math.random() > 0.8;

        const normalTexture = this.getMiddleTexture();
        const superTexture = this.getLastTexture();

        if (this.#isSuper) {
            this.setTextures(superTexture, normalTexture, superTexture);
        } else {
            this.setTextures(normalTexture, normalTexture, superTexture);
        }

        this.#setRandomPosition();
    }
    #setRandomPosition() {
        this.getSegments()[0].setX(Math.random() * 2 - 1)
        this.getSegments()[0].setY(Math.random() * 2 - 1)
    }
}