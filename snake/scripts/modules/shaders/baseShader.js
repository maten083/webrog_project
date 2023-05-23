export class ShaderDescription {
    attributes = {};

    /**
     *
     * @param {object} attributes
     */
    constructor(attributes = {}) {
        this.attributes = attributes;
    }
}

export class BaseShader {
    /** @type {WebGL2RenderingContext} */#gl
    /** @type {WebGLProgram} */#program
    /** @type {ShaderDescription} */#shaderDescription;

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLProgram} program
     * @param {ShaderDescription} shaderDescription
     */
    constructor(gl, program, shaderDescription) {
        this.#gl = gl;
        this.#program = program;
        this.#shaderDescription = shaderDescription;
    }

    /**
     * Binds the shader program into the context
     */

    use() {
        this.#gl.useProgram(this.#program);
    }

    /**
     * Gets all uniform location
     */
    getAllUniforms() {
        throw new Error("Please implement getAllUniforms method in your implementation!");
    }

    /**
     * Gets the location of the uniform
     * @param {string} name
     * @returns {WebGLUniformLocation}
     */
    getUniformLocation(name) {
        return this.#gl.getUniformLocation(this.#program, name);
    }

    /**
     * Binds all input attributes
     */
    bindAttributes() {
        const entries = Object.entries(this.#shaderDescription.attributes);
        for (const [key, value] of entries) {
            this.bindAttr(parseInt(key), value);
        }
    }

    /**
     * Binds an attribute into the shader
     * @param {GLuint} attribute
     * @param {string} name
     */
    bindAttr(attribute, name) {
        this.#gl.bindAttribLocation(this.#program, attribute, name)
    }

    /**
     * Unbinds the shader program
     */
    unbind() {
        this.#gl.useProgram(null);
    }

    /**
     * @param {WebGLUniformLocation} location
     * @param {number} value
     */
    loadFloat(location, value) {
        this.#gl.uniform1f(location, value)
    }
    /**
     * @param {WebGLUniformLocation} location
     * @param {Float32Array} vector
     */
    loadVector3F(location, vector) {
        this.#gl.uniform3f(location, vector[0], vector[1], vector[2])
    }
    /**
     * @param {WebGLUniformLocation} location
     * @param {boolean} value
     */
    loadBoolean(location, value) {
        this.#gl.uniform1f(location, value ? 1 : 0);
    }
    /**
     * @param {WebGLUniformLocation} location
     * @param {Float32Array} value
     */
    loadMatrix4F(location, value) {
        this.#gl.uniformMatrix4fv(location, false, value, 0, value.length);
    }
}