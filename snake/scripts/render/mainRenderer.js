import {MainShader} from "../modules/shaders/mainShader.js";
import {RawModel} from "../entities/baseEntitites/rawModel.js";

export class MainRenderer {
    /** @type{WebGL2RenderingContext} */#gl;
    /** @type{RawModel} */#model;

    /** @type {MainShader} */#program;

    /**
     * Create the render engine
     * @param {WebGL2RenderingContext} gl
     */
    constructor (gl) {
        this.#gl = gl;
    }

    /**
     * Initialize the render engine
     *
     * @param {Loader} loader
     */
    async init(loader) {
        this.#program = await MainShader.create(this.#gl);

        this.#model = RawModel.loadQuad(loader);
    }

    /**
     * Clears the previous scene
     */
    prepare() {
        this.#gl.clearColor(1, 0, 0, 1);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);
        this.#program.use();
    }

    /**
     * Renders the entities
     *
     * @param {Entity[]} entities
     */
    render(entities) {
        for (const entity of entities) {
            this.#gl.bindVertexArray(this.#model.getVao());

            this.#gl.enableVertexAttribArray(0);
            this.#gl.enableVertexAttribArray(1);

            this.#gl.activeTexture(this.#gl.TEXTURE0);
            this.#gl.bindTexture(this.#gl.TEXTURE_2D, entity.getTextures()[0]);

            for (const segment of entity.getSegments()) {
                this.#program.loadTransformationMatrix(segment.getTransformationMatrix());
                this.#gl.drawElements(this.#gl.TRIANGLES, this.#model.getVertexCount(), this.#gl.UNSIGNED_INT, 0);
            }

        }

        this.#gl.disableVertexAttribArray(1);
        this.#gl.disableVertexAttribArray(0);
        this.#gl.bindVertexArray(null);

        this.#program.unbind();
    }
}