import {SystemManager} from "./modules/systemManager.js";
import {Loader, TextureTypes} from "./render/loader.js";
import {Direction, Entity} from "./entities/entity.js";
import {Apple} from "./entities/apple.js";
import {MainRenderer} from "./render/mainRenderer.js";
import {FpsManager} from "./modules/fpsManager.js";
import {Snake} from "./entities/snake.js";

export class SnakeGame {
    /** @type{HTMLDivElement} */ #root;

    /** @type{HTMLCanvasElement} */ #canvas;

    /** @type{WebGL2RenderingContext} */ #gl;

    /** @type{number|null} */ #mainIntervalId;

    /** @type{SystemManager} */ #systemManager;
    /** @type{Loader} */ #loader;

    /** @type{Entity[]} */ #entities;

    /** @type{MainRenderer} */ #mainRenderer;

    /** @type{FpsManager} */ #fpsManager;

    /** @type{{SPEED: number}} */static variables = {
        SPEED: 0.2,
        AREA_WIDTH: 600,
        AREA_HEIGHT: 600,
        SUPER_DURATION: 200,
        SUPER_HEIGHT: 0.5
    };

    /** @type{Snake} */#snake;
    /** @type{Apple} */#apple;


    constructor() {
        this.#root = document.createElement("div");
        this.#root.id = "mount";
        document.body.insertAdjacentElement("afterbegin", this.#root);

        this.#systemManager = new SystemManager(this.#root);
        this.#entities = [];
    }

    /*
     * Public methods
     */

    async init() {
        this.#canvas = document.createElement("canvas");
        this.#canvas.width = SnakeGame.variables.AREA_WIDTH;
        this.#canvas.height = SnakeGame.variables.AREA_HEIGHT;
        this.#canvas.tabIndex = 1;
        this.#gl = this.#canvas.getContext("webgl2") || this.#canvas.getContext("experimental-webgl");

        if (this.#gl instanceof WebGL2RenderingContext) {
            this.#root.appendChild(this.#canvas);
            this.#canvas.focus();
            this.#systemManager.loadSystems(this.#root, this);
            this.#loader = new Loader(this.#gl);

            await this.#loader.loadTextures(this.#gl);

            this.#mainRenderer = new MainRenderer(this.#gl);
            await this.#mainRenderer.init(this.#loader);

            this.#apple = new Apple(0, 0, Direction.NONE);
            this.#apple.setTextures(this.#loader.getTexture(TextureTypes.APPLE),
                this.#loader.getTexture(TextureTypes.APPLE),
                this.#loader.getTexture(TextureTypes.SUPER_APPLE));

            this.#snake = new Snake(0, 0, Direction.RIGHT);
            this.#snake.setTextures(this.#loader.getTexture(TextureTypes.SNAKE_HEAD),
                this.#loader.getTexture(TextureTypes.SNAKE_BODY),
                this.#loader.getTexture(TextureTypes.SNAKE_TAIL));

            //this.#entities.push(this.#apple);
            this.#entities.push(this.#snake);

            this.#fpsManager = new FpsManager(this);
            this.#fpsManager.handleFpsChange();
            this.#addEventListeners();
        } else {
            this.alert("Az Ön böngészője nem támogatja a WebGL 2-t! Kérem váltson egy másik, modern böngészőre, vagy ellenőrizze a beállításait!");
        }
    }

    /**
     * Gets root element
     * @returns {HTMLCanvasElement}
     */
    getCanvas() {
        return this.#canvas;
    }
    /**
     * Gets root element
     * @returns {HTMLDivElement}
     */
    getRoot() {
        return this.#root;
    }
    /**
     * Gets the system manager
     * @returns {SystemManager}
     */
    getSystemManager() {
        return this.#systemManager;
    }

    /**
     * Get Snake entity
     * @returns {Snake}
     */
    getSnake() {
        return this.#snake;
    }

    /**
     * Get Apple entity
     * @returns {Apple}
     */
    getApple() {
        return this.#apple;
    }

    play() {
        this.#gl.viewport(0, 0, this.#gl.drawingBufferWidth, this.#gl.drawingBufferHeight);

        if (this.#mainIntervalId !== null)
            clearInterval(this.#mainIntervalId);
        const intervalTime = 1000 / this.#systemManager.getConfig().getFps();
        this.#mainIntervalId = setInterval(this.#gameLoop.bind(this), intervalTime);
    }

    alert(content) {
        const msg = document.createElement("div");
        msg.classList.add('alert');
        msg.innerText = content;
        this.#root.appendChild(msg);
    }

    /*
     * Private methods
     */
    #addEventListeners() {
        window.addEventListener("resize", function() {
            this.#gl.viewport(0, 0, this.#gl.drawingBufferWidth, this.#gl.drawingBufferHeight);
        }.bind(this));
    }
    #gameLoop() {
        const deltaTime = this.#fpsManager.updateFpsCounter();
        this.#systemManager.updateSystems(deltaTime);

        this.#mainRenderer.prepare();
        this.#mainRenderer.render(this.#entities);
    }
}