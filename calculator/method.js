import {Constants} from "./constants.js";

export class Methods {
    /**
     * @type{string|null} - null ha nincs jelenleg state; string, ha van (pl +, -, pow, etc)
     */
    static currentState = null;
    /**
     * @type{number|null} - null, ha nincs state, number ha van state
     */
    static previousNumber= null;

    /**
     * Ez akkor van használva, amikor a műveletnek kettő szám kell. Azaz például +, -, stb.
     * @param {number} input - label-nek az inputja - ha nem írt be semmi számot, akkor 0
     * @param {string|null} state - jelenlegi állás, amit az evaluate lekezel. Ha egyenlőség van lenyomva, akkor null
     */
    static pushState(input, state = null) {
        if (Methods.currentState === null) {
            Methods.currentState = state;
            Methods.previousNumber = input;

            return null;
        } else {
            Methods.evaluate(input);
            Methods.currentState = state;

            return Methods.previousNumber;
        }

    }

    /**
     * Ez akkor van használva, amikor az adott műveletnek MAX csak a jelenlegi szám kell. Azaz például: pow2, e
     * @param {number} input - label-nek az inputja - ha nem írt be semmi számot, akkor 0
     * @param {string} state - jelenlegi állás, amit az evaluate lekezel
     */
    static evalState(input, state) {
        Methods.currentState = state;
        Methods.evaluate(input);
        Methods.currentState = null;
        return Methods.previousNumber;
    }
    /**
     * Ez akkor van használva, amikor az egyenlőségjel van lenyomva
     * @param {number} input - label-nek az inputja - ha nem írt be semmi számot, akkor 0
     */
    static evalEquals(input) {
        Methods.evaluate(input);
        Methods.currentState = null;
        return Methods.previousNumber;
    }

    /**
     * @param {number|null} input - a jelenlegi input, ha nincs input, null (pl e-hez nem kell)
     * @returns {number|null} number, ha evaluálható az művelet, null, ha nem
     */
    static evaluate(input) {
        let value = null;
        switch (Methods.currentState) {
            case 'e':
                value = Constants.E;
                break;
            case 'π':
                value = Constants.PI;
                break;
            case 'x^2':
                value = input**2;
                break;
            case '!':
                value = Math.abs(input);
                while(input > 2) {
                    value *= (--input);
                }
                break;
            case '+':
                value = Methods.previousNumber + input;
                break;
            case '-':
                value = Methods.previousNumber - input;
                break;
            case '/':
                value = Methods.previousNumber / input;
                break;
            case '*':
                value = Methods.previousNumber * input;
                break;
            case 'x^y':
                value = Methods.previousNumber ** input;
                break;
            case '10^x':
                value = 10 ** input;
                break;
            case 'log2x':
                value = Math.log2(input);
                break;
            case 'lg':
                value = Math.log10(input);
                break;
            case 'ln':
                value = Math.log(input);
                break;
            case 'logxY':
                value = Math.log(input)/Math.log(Methods.previousNumber);
                break;
            case '1/x':
                value = 1 / input;
                break;
            case 'rand':
                value = Math.random();
                break;
            case '|x|':
                value = Math.abs(input);
                break;
            case 'mod':
                value = Methods.previousNumber % input;
                break;
            default:
                break;
        }
        Methods.previousNumber = value;

        return value;
    }
}