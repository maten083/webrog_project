import {SystemManager} from "./modules/systemManager.js";
import {Loader, TextureTypes} from "./render/loader.js";
import {Direction, Entity} from "./entities/entity.js";
import {Apple} from "./entities/apple.js";
import {MainRenderer} from "./render/mainRenderer.js";
import {FpsManager} from "./modules/fpsManager.js";
import {Snake} from "./entities/snake.js";
import {AudioKeys} from "./modules/systems/audioSystem.js";

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
    /** @type{boolean} */#isDead = false;
    /** @type{boolean} */#processedDeath = false;

    /** @type{number} */#score = 0;

    static variables = {
        AREA_WIDTH: 600,
        AREA_HEIGHT: 600,
        DEFAULT_SPEED: 0.4,
        SUPER_SPEED: 0.8,
        SPEED: 0.4,
        DEFAULT_SCALE: 1,
        SUPER_SCALE: 0.5,
        SCALE: 1,
        ALWAYS_SUPER: true,
        SUPER_TIMEOUT: 10,
        SUPER_TIMER: null,
        CLEAR: {
            R: 48 / 255,
            G: 107 / 255,
            B: 48 / 255
        }
    };

    /** @type{Snake} */#snake;
    /** @type{Apple} */#apple;

    /** @type{HTMLSpanElement} */#fpsCounter;
    /** @type{HTMLSpanElement} */#scoreCounter;

    /** @type{boolean} */#paused = true;
    /** @type{HTMLDivElement} */#pausedLabel;

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
        this.#canvas.setAttribute('style', `position: absolute; left: 0; top: 0;`);
        this.#canvas.tabIndex = 1;
        this.#gl = this.#canvas.getContext("webgl2") || this.#canvas.getContext("experimental-webgl");

        if (this.#gl instanceof WebGL2RenderingContext) {
            // Setup canvas container
            const canvasContainer = document.createElement('div');
            canvasContainer.id = "canvas-container";
            Object.assign(canvasContainer.style, {
                position: 'relative',
                width: `${SnakeGame.variables.AREA_WIDTH}px`,
                height: `${SnakeGame.variables.AREA_HEIGHT}px`
            })
            canvasContainer.appendChild(this.#canvas);

            // Setup paused label
            this.#pausedLabel = document.createElement('div');
            Object.assign(this.#pausedLabel.style, {
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                padding: '12px 7px',
                background: 'white',
                border: '1px solid black',
                fontWeight: 'bold',
                color: 'red'
            });
            this.#pausedLabel.innerText = 'PAUSED';
            canvasContainer.appendChild(this.#pausedLabel);

            this.#root.appendChild(canvasContainer);
            this.#canvas.focus();
            this.#systemManager.loadSystems(this.#root, this);
            this.#loader = new Loader(this.#gl);

            await this.#loader.loadTextures(this.#gl);

            this.#mainRenderer = new MainRenderer(this.#gl);
            await this.#mainRenderer.init(this.#loader);

            this.#snake = new Snake(0, 0, Direction.RIGHT);
            this.#snake.setTextures(this.#loader.getTexture(TextureTypes.SNAKE_HEAD),
                this.#loader.getTexture(TextureTypes.SNAKE_BODY),
                this.#loader.getTexture(TextureTypes.SNAKE_TAIL));

            this.#apple = new Apple(this.#snake);
            this.#apple.setTextures(this.#loader.getTexture(TextureTypes.APPLE),
                this.#loader.getTexture(TextureTypes.APPLE),
                this.#loader.getTexture(TextureTypes.SUPER_APPLE));


            this.#entities.push(this.#apple);
            this.#entities.push(this.#snake);

            this.#fpsManager = new FpsManager(this);
            this.#fpsManager.handleFpsChange();
            this.#addEventListeners();

            this.#fpsCounter = document.createElement('span');
            this.#fpsCounter.innerText = "0 FPS";
            this.#root.insertAdjacentElement("afterbegin", this.#fpsCounter);

            // Setup score label
            this.#scoreCounter = document.createElement('span');
            this.#scoreCounter.innerText = "Score: 0";
            this.#root.insertAdjacentElement("beforeend", this.#scoreCounter);


            const musicLabel = document.createElement("label");
            musicLabel.for = "music-dropdown";
            musicLabel.innerText = "Background Music: ";

            const musicDropdown = document.createElement('select');
            musicDropdown.id = "music-dropdown";
            musicDropdown.name = "music-dropdown";
            const availableMusics = this.#systemManager.getAudio().getAvailableMusics();
            const currentlySelectedMusic = `${this.#systemManager.getConfig().getSelectedMusic()}`;
            for (let i = 0; i < availableMusics.length; i++) {
                const option = document.createElement('option');
                option.value = `${i}`;
                option.text = availableMusics[i].title;

                if (currentlySelectedMusic === option.value) {
                    option.selected = true;
                }

                musicDropdown.appendChild(option);
            }
            musicDropdown.addEventListener("change", _ => {
                this.#systemManager.getConfig().setSelectedMusic(musicDropdown.selectedIndex);
            });

            const musicDropdownContainer = document.createElement("div");
            musicDropdownContainer.appendChild(musicLabel);
            musicDropdownContainer.appendChild(musicDropdown);
            this.#fpsCounter.insertAdjacentElement("beforebegin", musicDropdownContainer);

            const infoBox = document.createElement('div');
            infoBox.innerHTML = `
            <h1 class="generic-information-header">Generic information:</h1>
            Controls: (future plan: change key mapping - partially implemented right now)
            <ul>
                <li>Up: W</li>
                <li>Down: S</li>
                <li>Left: A</li>
                <li>Right: D</li>
                <li>Pause / unpause: Space</li>
            </ul>
            Apples:
            <ul>
                <li>Yellow apple: gives you 'super' status</li>
                <li>Red apple: normal apple, does not clear 'super' status</li>
            </ul>
            Statuses:
            <ul>
                <li>Super: you get a speed boost, smaller size, and you do not die if you hit yourself. Lasts for ${SnakeGame.variables.SUPER_TIMEOUT} seconds</li>
            </ul>
            Background musics:
            <ul>
                <li>Rinne - Awaken: <a href="https://www.youtube.com/watch?v=sketw8SjyrI" target="_blank">Youtube</a></li>
                <li>Mitsukiyo - Awaken: <a href="https://www.youtube.com/watch?v=OrRjz5YjACM" target="_blank">Youtube</a></li>
            </ul>
            SFX from: <a href="https://mixkit.co/free-sound-effects/" target="_blank">Mixkit Free sound effects</a>
            <br /><br />
            `;
            musicDropdownContainer.insertAdjacentElement('beforebegin', infoBox)

            const checkboxTarget = infoBox.querySelector('.generic-information-header');
            const superCheckbox = document.createElement('input');
            superCheckbox.id = superCheckbox.name = 'super-checkbox';
            superCheckbox.type = 'checkbox';
            superCheckbox.checked = SnakeGame.variables.ALWAYS_SUPER;
            superCheckbox.addEventListener('change', _ => {
                SnakeGame.variables.ALWAYS_SUPER = superCheckbox.checked;
            })
            const superCheckboxLabel = document.createElement('label');
            superCheckboxLabel.setAttribute('for', 'super-checkbox');
            superCheckboxLabel.innerText = "Always generate super apple";
            const superCheckboxContainer = document.createElement('div');
            Object.assign(superCheckboxContainer.style, {
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center'
            });
            superCheckboxContainer.appendChild(superCheckboxLabel);
            superCheckboxContainer.appendChild(superCheckbox);
            checkboxTarget.insertAdjacentElement('afterend', superCheckboxContainer);
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

    /**
     * Check if the game is paused
     * @returns {boolean}
     */
    isPaused() {
        return this.#paused;
    }

    togglePaused() {
        const audio = this.getSystemManager().getAudio();

        if (!this.#isDead) {
            this.#paused = !this.#paused;
            if (this.#paused) {
                audio.pauseBackgroundMusic();
            } else {
                audio.playBackgroundMusic();
            }
        } else if(!this.#processedDeath) {
            this.#processedDeath = true;
            audio.pauseBackgroundMusic();
            audio.get(AudioKeys.FAIL).play();
        }

        this.#checkPaused();
    }


    /*
     * Private methods
     */
    #checkPaused() {
        this.#pausedLabel.style.display = this.#paused ? null : 'none';
    }

    #addEventListeners() {
        window.addEventListener("resize", function() {
            this.#gl.viewport(0, 0, this.#gl.drawingBufferWidth, this.#gl.drawingBufferHeight);
        }.bind(this));
    }
    #gameLoop() {
        const deltaTime = this.#fpsManager.updateFpsCounter(fps => {
            this.#fpsCounter.innerText = `${fps} FPS`;
        });

        const dead = this.#systemManager.updateSystems(deltaTime, this.#paused);

        this.#mainRenderer.prepare();
        this.#mainRenderer.render(this.#entities);

        if (dead) {
            this.#dead();
            this.togglePaused();
        }

        const currentScore = this.#snake.getSegments().length - 2;
        if (currentScore !== this.#score) {
            this.#score = currentScore;
            this.#scoreCounter.innerText = `Score: ${this.#score}`;
        }
    }
    #dead() {
        this.#isDead = true;
        this.#paused = true;
        this.#pausedLabel.innerHTML = `You died.<br /><a href="javascript:window.location.reload()">Restart?</a>`
        clearInterval(this.#mainIntervalId);
    }
}