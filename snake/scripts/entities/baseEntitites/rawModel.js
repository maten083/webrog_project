export class RawModel {
    /** @type{WebGLVertexArrayObject} */#vao;
    /** @type{number} */#count;

    /**
     *
     * @param {WebGLVertexArrayObject} vao
     * @param {number} vertexCount
     */
    constructor(vao, vertexCount) {
        this.#vao = vao;
        this.#count = vertexCount;
    }

    /**
     * Get VAO ID
     * @returns {WebGLVertexArrayObject}
     */
    getVao() {
        return this.#vao;
    }

    /**
     * Get the amount of vertices in the VAO
     * @returns {number}
     */
    getVertexCount() {
        return this.#count;
    }

    /**
     * Loads a quad
     * @param {Loader} loader
     *
     * @returns {RawModel}
     */
    static loadQuad(loader) {
        const positions = [
            -1, 1, 0,
            -1, -1, 0,
            1, -1, 0,
            1, 1, 0,
        ];
        const indices = [ 0, 1, 3, 3, 1, 2 ];
        const textureCoords = [ 0, 0, 0, 1, 1, 1, 1, 0 ];
        return loader.loadToVAO(new Float32Array(positions), new Float32Array(textureCoords), new Int32Array(indices));
    }
}