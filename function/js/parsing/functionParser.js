import {FunctionElement} from "./functionElement.js";
import {SupportMethods} from "./supportMethods.js";

export class FunctionParser {
    /**
     * @type {FunctionElement[]}
     */
    static functionElements = [];
    /**
     * @type {Map<string, FunctionElement>}
     */
    static functionElementMap = new Map();
    /**
     * @type {{name: string, order: number}[]}
     */
    static functionOrder = [];

    /**
     * Whether to use degrees instead of radians
     * @type {boolean}
     */
    static useDeg = true;

    /**
     * The regex to parse the operators
     * @type {RegExp}
     */
    static regex = RegExp('', 'g');

    /**
     * The function the user has inputted
     * @type {string}
     */
    text = '';

    /**
     * Create a new function parser
     * @param {string} text
     */
    constructor(text) {
        this.text = text;
    }

    /**
     * Initialize the Function parser's static variables.
     */
    static init() {
        FunctionParser.functionElements = [
            new FunctionElement('+', SupportMethods.add, 1),
            new FunctionElement('-', SupportMethods.sub, 1),
            new FunctionElement('*', SupportMethods.mult, 2),
            new FunctionElement('/', SupportMethods.div, 2),
            new FunctionElement('%', SupportMethods.mod, 2),
            new FunctionElement('^', Math.pow, 3),
            new FunctionElement('sqrt', Math.sqrt, 3),
            new FunctionElement('sin', SupportMethods.sin, 3),
            new FunctionElement('cos', SupportMethods.cos, 3),
            new FunctionElement('tan', SupportMethods.tan, 3),
            new FunctionElement('cotan', SupportMethods.cotan, 3)
        ];

        let stringParams = '';

        const escapeCharacters = ['+', '*', '/', '^']

        for (const element of FunctionParser.functionElements) {
            FunctionParser.functionElementMap.set(element.element, element);
            FunctionParser.functionOrder.push({
                name: element.element,
                order: element.order
            });
            if (escapeCharacters.includes(element.element)) {
                stringParams += '\\';
            }
            stringParams += `${element.element}\\s|`;
        }
        stringParams = stringParams.substring(0, stringParams.length - 1);

        FunctionParser.regex = new RegExp(`(${stringParams})`, 'g');
    }

    /**
     * Evaluates the given expression, and replaces and occurrence of 'x' with the variable
     *
     * @param {number} variableValue
     * @returns {number}
     */
    evaluate(variableValue) {
        // Insert the value into the function
        const inserted = this.text.replace(/x/g, `${variableValue}`);

        return this.#evaluateExpression(inserted);
    }

    /**
     * Evaluates the specific expression, without having any variables
     *
     * @param {string} expression
     * @returns {number}
     */
    #evaluateExpression(expression) {
        const tokens = this.#tokenize(expression);
        const postfix = this.#convertToPostfix(tokens);
        return this.#evaluatePostfix(postfix);
    }

    /**
     * Tokenizes (splits expression into numbers and methods) the expression
     * @param {string} expression the expression to be tokenized
     * @returns {string[]}
     */
    #tokenize(expression) {
        return expression.split(FunctionParser.regex).filter(token => token.trim() !== '').map(t => t.trim());
    }

    /**
     * Converts tokenized expression into postfix
     *
     * @param {string[]} tokens - the expression tokens after tokenization
     * @returns {string[]}
     */
    #convertToPostfix(tokens) {
        const stack = [];
        const output = [];

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if (!isNaN(parseFloat(token))) {
                // Token is a number
                output.push(token);
            } else if (token === '(') {
                // Token is an opening parenthesis
                stack.push(token);
            } else if (token === ')') {
                // Token is a closing parenthesis
                while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                    output.push(stack.pop());
                }
                stack.pop(); // Discard the opening parenthesis
            } else {
                // Token is an operator
                while (stack.length > 0
                && FunctionParser.functionOrder[token] <= FunctionParser.functionOrder[stack[stack.length - 1]]) {
                    output.push(stack.pop());
                }
                stack.push(token);
            }
        }

        while (stack.length > 0) {
            output.push(stack.pop());
        }

        return output;
    }

    /**
     * Calculates the expression, which is in postfix format
     * @param {string[]} postfix
     * @returns {number|null}
     */
    #evaluatePostfix(postfix) {
        const stack = [];

        for (let i = 0; i < postfix.length; i++) {
            const token = postfix[i];

            if (!isNaN(parseFloat(token))) {
                // Token is a number
                stack.push(parseFloat(token));
            } else {
                // Token is an operator
                let result;

                if (FunctionParser.functionElementMap.has(token)) {
                    const operand2 = stack.pop();
                    let operand1 = null;
                    if (FunctionParser.functionElementMap.get(token).evaluation.length > 1)
                        operand1 = stack.pop();

                    const functionElement = FunctionParser.functionElementMap.get(token);
                    if (functionElement.isValid) {
                        if (FunctionParser.functionElementMap.get(token).evaluation.length === 1) {
                            result = FunctionParser.functionElementMap.get(token).evaluation(operand2);
                        } else {
                            result = FunctionParser.functionElementMap.get(token).evaluation(operand1, operand2);
                        }
                    } else {
                        alert(`The function ${token} is invalid!`);
                        return null;
                    }
                } else {
                    alert(`The function ${token} is unknown!`);
                    return null;
                }

                stack.push(result);
            }
        }

        return stack.pop();
    }
}