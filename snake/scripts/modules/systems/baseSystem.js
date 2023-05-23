export class BaseSystem {
    /** @type{HTMLDivElement} */root;
    /** @type{string} */type;
    /** @type{SnakeGame} */snakeGame;

    /**
     *
     * @param {string} type
     * @param {HTMLDivElement} root
     * @param {SnakeGame} snakeGame
     */
    constructor(type, root, snakeGame) {
        this.root = root;
        this.type = type;
        this.snakeGame = snakeGame;
    }
    /**
     * Implementation required
     */
    init() {
        throw new Error("Init method was not implemented in the subsystem");
    }
    
    update(deltaTime) {}
}