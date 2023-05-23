export class ShaderManager {
    /**
     * Initialize shader program based on vertex and fragment shaders
     * @param {WebGL2RenderingContext} gl
     * @param {'main'} type
     * @returns {Promise<WebGLProgram|null>}
     */
    static async initShaderProgram(gl, type = 'main') {
        const vertexSrc = await ShaderManager.#loadShaderSource(type, 'vertex');
        const fragmentSrc = await ShaderManager.#loadShaderSource(type, 'fragment');

        const vertexShader = ShaderManager.#loadShader(gl, gl.VERTEX_SHADER, vertexSrc);
        const fragmentShader = ShaderManager.#loadShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);

        if (!vertexShader || !fragmentShader)
            return null;

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
            return null;
        }

        return shaderProgram;
    }


    /**
     * Loads shader source. Format: shaders/{name}Shader.glsl
     * @param {string} name
     * @param {'vertex'|'fragment'} type
     * @returns {Promise<string>}
     */
    static async #loadShaderSource(name, type){
        const newName = `${name}${type[0].toUpperCase()}${type.substring(1)}`;
        return await (await fetch(`scripts/modules/shaders/src/${newName}Shader.glsl`)).text();
    }

    /**
     * Loads a shader into OpenGL
     * @param {WebGL2RenderingContext} gl
     * @param {number} type
     * @param {string} source
     * @returns {WebGLShader|null}
     */
    static #loadShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(`An error occurred compiling the ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"} shader: ${gl.getShaderInfoLog(shader)}`);
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }
}