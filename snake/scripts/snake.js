import {SystemManager} from "./modules/systemManager.js";

export class Snake {
    /** @type{HTMLDivElement} */
    #root;

    /** @type{HTMLCanvasElement} */
    #canvas;
    /** @type{WebGLRenderingContext} */
    #gl;

    /** @type{SystemManager} */
    #systemManager;

    constructor() {
        this.#root = document.createElement("div");
        this.#root.id = "mount";
        document.body.insertAdjacentElement("afterbegin", this.#root);

        this.#systemManager = new SystemManager(this.#root);
    }

    /*
     * Public methods
     */

    init() {
        this.#canvas = document.createElement("canvas");
        this.#gl = this.#canvas.getContext("webgl") || this.#canvas.getContext("experimental-webgl");

        if (this.#gl instanceof WebGLRenderingContext) {
            this.#root.appendChild(this.#canvas);
            this.#systemManager.loadSystems();

        } else {
            this.alert("Az Ön böngészője nem támogatja a WebGL-t! Kérem váltson egy másik, modern böngészőre!");
        }
    }

    play() {
        this.#gameLoop();
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
        
    }
    #createInterval() {

    }
    #gameLoop() {
        const gl = this.#gl;
        const canvas = this.#canvas;

        
        
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clearColor(0, 1, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
}