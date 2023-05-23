export class FpsManager {
    /** @type{SnakeGame} */#snake;
    /** @type{ConfigSystem} */#config;

    /** @type{number} */#fpsCounter = 0;
    /** @type{DOMHighResTimeStamp} */#fpsTimeLimit;

    /** @type{DOMHighResTimeStamp} */#lastFrameTime;

    /**
     * @param {SnakeGame} snake
     */
    constructor(snake) {
        this.#snake = snake;
        this.#config = snake.getSystemManager().getConfig();
        this.#fpsTimeLimit = this.#lastFrameTime = performance.now();
    }

    updateFpsCounter() {
        const now = performance.now();

        if (now - this.#fpsTimeLimit > 1000) {
            this.#fpsTimeLimit = now;

            console.log(this.#fpsCounter);

            this.#fpsCounter = 0;
        } else {
            this.#fpsCounter++;
        }

        const delta = now - this.#lastFrameTime;
        this.#lastFrameTime = now;
        return delta / 1000;
    }

    handleFpsChange() {
        this.#snake.getRoot().addEventListener('config_changed', e => {
            if (e.detail.type === 'fps') {
                this.#snake.play()
            }
        })
    }


}