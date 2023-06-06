import {RawModel} from "../entities/baseEntitites/rawModel.js";

/**
 * @readonly
 * @enum {number}
 */
const TextureTypes = {
    APPLE: 0,
    SUPER_APPLE: 1,
    SNAKE_HEAD: 2,
    SNAKE_BODY: 3,
    SNAKE_TAIL: 4
}
export class Loader {
    /** @type{Map<TextureTypes, WebGLTexture>} */#textureMap;

    /** @type{WebGL2RenderingContext} */#gl;

    /**
     * @param {WebGL2RenderingContext} gl
     */
    constructor(gl) {
        this.#gl = gl;
        this.#textureMap = new Map();
    }

    /**
     * Load attributes to VAO
     * @param {Float32Array} positions
     * @param {Float32Array} textureCoords
     * @param {Int32Array} indices
     */
    loadToVAO(positions, textureCoords, indices) {
        const vao = this.#createVAO();
        this.#bindIndicesBuffer(indices);
        this.#storeDataInAttributeList(0, 3, positions);
        this.#storeDataInAttributeList(1, 2, textureCoords);
        this.#unbindVAO();
        return new RawModel(vao, indices.length);
    }

    /**
     * Caches all the textures
     * @param {WebGL2RenderingContext} gl
     * @returns {Promise<void>}
     */
    async loadTextures(gl) {
        // The order matches the TextureTypes enum
        const textures = [
            'assets/imgs/apple.png',
            'assets/imgs/super_apple.png',
            'assets/imgs/snake_head.png',
            'assets/imgs/snake_body.png',
            'assets/imgs/snake_tail.png'
        ]

        /**
         *
         * @param {string} url
         * @returns {Promise<Image|null>}
         */
        const loadImage = (url) => {
            return new Promise((resolve, _) => {
                const img = new Image();
                img.onload = () => {
                    resolve(img);
                };
                img.onerror = () => {
                    resolve(null);
                };
                img.src = url;
            });
        }

        for (let i = 0; i < textures.length; i++) {
            const image = await loadImage(textures[i]);
            if (image === null) {
                alert(`Failed to load texture: ${textures[i]}!`);
                break;
            }
            const texture = this.#createTexture(gl, image);
            this.#textureMap.set(i, texture);
        }
    }

    /**
     * @param {TextureTypes} key
     *
     * @returns {WebGLTexture}
     */
    getTexture(key) {
        return this.#textureMap.get(key);
    }

    /**
     * Creates a VAO and binds it
     * @returns {WebGLVertexArrayObject}
     */
    #createVAO() {
        const vao = this.#gl.createVertexArray();
        this.#gl.bindVertexArray(vao);
        return vao;
    }

    /**
     * Creates a VBO and stores it in the currently bound VAO
     * @param {GLuint} number
     * @param {number} dimension
     * @param {Float32Array} data
     */
    #storeDataInAttributeList(number, dimension, data) {
        const vbo = this.#gl.createBuffer();
        this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, vbo);
        this.#gl.bufferData(this.#gl.ARRAY_BUFFER, data, this.#gl.STATIC_DRAW);
        this.#gl.vertexAttribPointer(number, dimension, this.#gl.FLOAT, false, 0, 0);
        this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, null);
    }

    /**
     * Create index buffer
     * @param {Int32Array} indices
     */
    #bindIndicesBuffer(indices) {
        const vbo = this.#gl.createBuffer();
        this.#gl.bindBuffer(this.#gl.ELEMENT_ARRAY_BUFFER, vbo);
        this.#gl.bufferData(this.#gl.ELEMENT_ARRAY_BUFFER, indices, this.#gl.STATIC_DRAW);
    }

    /**
     * Unbinds the current VAO
     */
    #unbindVAO() {
        this.#gl.bindVertexArray(null);
    }

    /**
     * Creates a new texture
     *
     * @param {WebGL2RenderingContext} gl
     * @param {Image} image
     *
     * @returns {WebGLTexture}
     */
    #createTexture(gl, image) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        return texture;
    }
}
export { TextureTypes }