import {FunctionParser} from "./functionParser.js";

export class SupportMethods {
    static add(a, b) {
        return a + b;
    }
    static sub(a, b) {
        return a - b;
    }
    static mult(a, b) {
        return a * b;
    }
    static div(a, b) {
        return a / b;
    }
    static mod(a, b) {
        return a % b;
    }

    static sin(a) {
        if (FunctionParser.useDeg) {
            return Math.sin(Math.PI * a / 180);
        } else {
            return Math.sin(a);
        }
    }
    static cos(a) {
        if (FunctionParser.useDeg) {
            return Math.cos(Math.PI * a / 180);
        } else {
            return Math.cos(a);
        }
    }
    static tan(a) {
        if (FunctionParser.useDeg) {
            return Math.tan(Math.PI * a / 180);
        } else {
            return Math.tan(a);
        }
    }
    static cotan(a) {
        if (FunctionParser.useDeg) {
            return 1 / Math.tan(Math.PI * a / 180);
        } else {
            return 1 / Math.tan(a);
        }
    }
}