export class Matrix4f {
    /** @type{number} */m00= 0;
    /** @type{number} */m01= 0;
    /** @type{number} */m02= 0;
    /** @type{number} */m03= 0;

    /** @type{number} */m10= 0;
    /** @type{number} */m11= 0;
    /** @type{number} */m12= 0;
    /** @type{number} */m13= 0;

    /** @type{number} */m20= 0;
    /** @type{number} */m21= 0;
    /** @type{number} */m22= 0;
    /** @type{number} */m23= 0;

    /** @type{number} */m30= 0;
    /** @type{number} */m31= 0;
    /** @type{number} */m32= 0;
    /** @type{number} */m33= 0;

    constructor({   m00 = 0, m01 = 0, m02 = 0, m03 = 0,
                    m10 = 0, m11 = 0, m12 = 0, m13 = 0,
                    m20 = 0, m21 = 0, m22 = 0, m23 = 0,
                    m30 = 0, m31 = 0, m32 = 0, m33 = 0 }) {
        this.m00 = m00;
        this.m01 = m01;
        this.m02 = m02;
        this.m03 = m03;
        this.m10 = m10;
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m20 = m20;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m30 = m30;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
    }

    /**
     * Creates an identity matrix
     * @returns {Matrix4f}
     */
    static identity() {
        const identity = {
            m00: 1, m01: 0, m02: 0, m03: 0,
            m10: 0, m11: 1, m12: 0, m13: 0,
            m20: 0, m21: 0, m22: 1, m23: 0,
            m30: 0, m31: 0, m32: 0, m33: 1
        };
        return new Matrix4f(identity);
    }

    /**
     * Multiply two matrices
     * @param {Matrix4f} matrix
     */
    multiply(matrix) {
        const result = Matrix4f.identity();

        result.m00 = this.m00 * matrix.m00 + this.m10 * matrix.m01 + this.m20 * matrix.m02 + this.m30 * matrix.m03;
        result.m01 = this.m01 * matrix.m00 + this.m11 * matrix.m01 + this.m21 * matrix.m02 + this.m31 * matrix.m03;
        result.m02 = this.m02 * matrix.m00 + this.m12 * matrix.m01 + this.m22 * matrix.m02 + this.m32 * matrix.m03;
        result.m03 = this.m03 * matrix.m00 + this.m13 * matrix.m01 + this.m23 * matrix.m02 + this.m33 * matrix.m03;

        result.m10 = this.m00 * matrix.m10 + this.m10 * matrix.m11 + this.m20 * matrix.m12 + this.m30 * matrix.m13;
        result.m11 = this.m01 * matrix.m10 + this.m11 * matrix.m11 + this.m21 * matrix.m12 + this.m31 * matrix.m13;
        result.m12 = this.m02 * matrix.m10 + this.m12 * matrix.m11 + this.m22 * matrix.m12 + this.m32 * matrix.m13;
        result.m13 = this.m03 * matrix.m10 + this.m13 * matrix.m11 + this.m23 * matrix.m12 + this.m33 * matrix.m13;

        result.m20 = this.m00 * matrix.m20 + this.m10 * matrix.m21 + this.m20 * matrix.m22 + this.m30 * matrix.m23;
        result.m21 = this.m01 * matrix.m20 + this.m11 * matrix.m21 + this.m21 * matrix.m22 + this.m31 * matrix.m23;
        result.m22 = this.m02 * matrix.m20 + this.m12 * matrix.m21 + this.m22 * matrix.m22 + this.m32 * matrix.m23;
        result.m23 = this.m03 * matrix.m20 + this.m13 * matrix.m21 + this.m23 * matrix.m22 + this.m33 * matrix.m23;

        result.m30 = this.m00 * matrix.m30 + this.m10 * matrix.m31 + this.m20 * matrix.m32 + this.m30 * matrix.m33;
        result.m31 = this.m01 * matrix.m30 + this.m11 * matrix.m31 + this.m21 * matrix.m32 + this.m31 * matrix.m33;
        result.m32 = this.m02 * matrix.m30 + this.m12 * matrix.m31 + this.m22 * matrix.m32 + this.m32 * matrix.m33;
        result.m33 = this.m03 * matrix.m30 + this.m13 * matrix.m31 + this.m23 * matrix.m32 + this.m33 * matrix.m33;

        // Apply the result to the current instance
        this.m00 = result.m00;
        this.m01 = result.m01;
        this.m02 = result.m02;
        this.m03 = result.m03;

        this.m10 = result.m10;
        this.m11 = result.m11;
        this.m12 = result.m12;
        this.m13 = result.m13;

        this.m20 = result.m20;
        this.m21 = result.m21;
        this.m22 = result.m22;
        this.m23 = result.m23;

        this.m30 = result.m30;
        this.m31 = result.m31;
        this.m32 = result.m32;
        this.m33 = result.m33;
    }

    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} rot
     * @param {number} scale
     */
    translate(x, y, rot, scale) {
        const cosX = Math.cos(0);
        const sinX = Math.sin(0);
        const cosY = Math.cos(0);
        const sinY = Math.sin(0);
        const cosZ = Math.cos(rot);
        const sinZ = Math.sin(rot);

        this.m00 = scale * (cosY * cosZ);
        this.m10 = scale * (sinZ * cosY);
        this.m20 = scale * (-sinY);

        this.m01 = scale * (cosX * sinZ + sinX * sinY * cosZ);
        this.m11 = scale * (cosX * cosZ - sinX * sinY * sinZ);
        this.m21 = scale * (sinX * cosY);

        this.m02 = scale * (sinX * sinZ - cosX * sinY * cosZ);
        this.m12 = scale * (sinX * cosZ + cosX * sinY * sinZ);
        this.m22 = scale * (cosX * cosY);

        this.m03 = x;
        this.m13 = y;
        this.m23 = 0;

        this.m30 = 0;
        this.m31 = 0;
        this.m32 = 0;
        this.m33 = 1;
    }

    toArray() {
        return new Float32Array([
            this.m00,
            this.m10,
            this.m20,
            this.m30,

            this.m01,
            this.m11,
            this.m21,
            this.m31,

            this.m02,
            this.m12,
            this.m22,
            this.m32,

            this.m03,
            this.m13,
            this.m23,
            this.m33,
        ])
    }

    transpose() {
        let temp;
        temp = this.m01;
        this.m01 = this.m10;
        this.m10 = temp;

        temp = this.m02;
        this.m02 = this.m20;
        this.m20 = temp;

        temp = this.m03;
        this.m03 = this.m30;
        this.m30 = temp;

        temp = this.m12;
        this.m12 = this.m21;
        this.m21 = temp;

        temp = this.m13;
        this.m13 = this.m31;
        this.m31 = temp;

        temp = this.m23;
        this.m23 = this.m32;
        this.m32 = temp;
    }
}