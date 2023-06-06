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
}