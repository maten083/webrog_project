import {FunctionParser} from "../parsing/functionParser.js";

export class TestCase {
    /**
     * The expression
     * @type {string}
     */
    expression;
    /**
     * Zhe value the expression should evaluate to
     * @type {number}
     */
    expectedValue;
    /**
     * The variable value, if there is a variable
     * @type {number|null}
     */
    variableValue;

    /**
     * The result of the expression after evaluation
     * @type {number|null}
     */
    expressionResult = null;
    /**
     * Whether the testcase successfully ran
     * @type {boolean|null}
     */
    #success = null;


    /**
     * Create a new test case
     * @param {string} expression the expression
     * @param {number} expectedValue the value the expression should evaluate to
     * @param {number|null} variableValue the value of the variable, or null if the expression does not contain one
     */
    constructor(expression, expectedValue, variableValue = null) {
        this.expression = expression;
        this.expectedValue = expectedValue;
        this.variableValue = variableValue;
    }

    get isCompleted() {
        return this.#success !== null;
    }

    get isSuccess() {
        return this.#success === true;
    }

    get hasVariable() {
        return this.variableValue !== null;
    }

    validate() {
        const parser = new FunctionParser(this.expression);
        this.expressionResult = parser.evaluate(this.variableValue);

        this.#success = this.expressionResult === this.expectedValue;

        return this.#success;
    }
}