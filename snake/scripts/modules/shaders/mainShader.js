import {BaseShader, ShaderDescription} from "./baseShader.js";
import {ShaderManager} from "../shaderManager.js";

export class MainShader extends BaseShader {
    /** @type{WebGLUniformLocation} */transformationLocation;

    /**
     * @param {WebGL2RenderingContext} gl
     * @returns {Promise<MainShader>}
     */
    static async create(gl) {
        const program = await ShaderManager.initShaderProgram(gl);
        const desc = new ShaderDescription({
            0: "position",
            1: "textureCoords"
        });

        const mainShader = new MainShader(gl, program, desc);
        mainShader.bindAttributes();
        mainShader.getAllUniforms();

        return mainShader;
    }

    getAllUniforms() {
        this.transformationLocation = this.getUniformLocation("transformation");
    }

    /**
     * Loads the transformation matrix
     * @param {Matrix4f} matrix
     */
    loadTransformationMatrix(matrix) {
        this.loadMatrix4F(this.transformationLocation, matrix.toArray());
    }
}