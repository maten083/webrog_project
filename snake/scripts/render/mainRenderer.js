import {MainShader} from "../modules/shaders/mainShader.js";
import {RawModel} from "../entities/baseEntitites/rawModel.js";
import {SnakeGame} from "../snakeGame.js";

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
        this.#gl.enable(this.#gl.BLEND);
        this.#gl.blendEquation(this.#gl.FUNC_ADD);
        this.#gl.blendFunc(this.#gl.SRC_ALPHA, this.#gl.ONE_MINUS_SRC_ALPHA);
        this.#gl.clearColor(SnakeGame.variables.CLEAR.R,
            SnakeGame.variables.CLEAR.G,
            SnakeGame.variables.CLEAR.B,
            1);
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
            this.#gl.bindTexture(this.#gl.TEXTURE_2D, entity.getFirstTexture());

            const segments = entity.getSegments();

            if (entity.isInvariantTextures()) {
                for (let i = 0; i < segments.length; i++) {
                    this.#program.loadTransformationMatrix(segments[i].getTransformationMatrix());
                    this.#gl.drawElements(this.#gl.TRIANGLES, this.#model.getVertexCount(), this.#gl.UNSIGNED_INT, 0);
                }
            } else {
                // Render first segment
                this.#program.loadTransformationMatrix(segments[0].getTransformationMatrix());
                this.#gl.drawElements(this.#gl.TRIANGLES, this.#model.getVertexCount(), this.#gl.UNSIGNED_INT, 0);

                // Render middle segments
                this.#gl.bindTexture(this.#gl.TEXTURE_2D, entity.getMiddleTexture());

                for (let i = 1; i < segments.length -1; i++) {
                    this.#program.loadTransformationMatrix(segments[i].getTransformationMatrix());
                    this.#gl.drawElements(this.#gl.TRIANGLES, this.#model.getVertexCount(), this.#gl.UNSIGNED_INT, 0);
                }

                // Render last segment
                this.#gl.bindTexture(this.#gl.TEXTURE_2D, entity.getLastTexture());

                this.#program.loadTransformationMatrix(segments[segments.length - 1].getTransformationMatrix());
                this.#gl.drawElements(this.#gl.TRIANGLES, this.#model.getVertexCount(), this.#gl.UNSIGNED_INT, 0);
            }

        }

        this.#gl.disableVertexAttribArray(1);
        this.#gl.disableVertexAttribArray(0);
        this.#gl.bindVertexArray(null);

        this.#program.unbind();
    }
}