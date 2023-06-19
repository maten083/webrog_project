import {FunctionParser} from "./parsing/functionParser.js";
import {TestCases} from "./test/testCases.js";
import {InputColumn} from "./graph/inputColumn.js";
import {GraphColumn} from "./graph/graphColumn.js";

export default class FunctionGraph {
    /**
     * The math function
     * @type {string}
     */
    #mathFunction = '';
    /**
     * The parser for the math function
     * @type {FunctionParser|null}
     */
    #functionParser = null;

    /**
     * @type {InputColumn}
     */
    #inputColumn;
    /**
     * @type {GraphColumn}
     */
    #graphColumn;

    /**
     * Initializes the FunctionGraph class
     */
    init() {
        FunctionParser.init();

        this.render();

        TestCases.render();
    }

    /**
     * Renders the FunctionGraph class
     */
    render() {
        const container = document.createElement('div');
        container.id = "main-container";

        this.#inputColumn = new InputColumn(this);
        this.#graphColumn = new GraphColumn(this);

        container.appendChild(this.#inputColumn.render());
        container.appendChild(this.#graphColumn.render());

        document.getElementsByTagName('body')[0].appendChild(container);
    }

    /**
     * Sets the math function
     * @param {string} func
     */
    setFunction(func) {
        this.#mathFunction = func;
    }

    /**
     * Calculates the function based on the input values, and resets the viewport of the graph
     *
     * @param {number} minX where should the X start
     * @param {number} maxX where should the X end
     * @param {number} xRange specifies the range (from -xRange to xRange) of the viewport horizontally
     * @param {number} yRange specifies the range (from -yRange to yRange) of the viewport vertically
     */
    calculateFunction(minX, maxX, xRange, yRange) {
        this.#functionParser = new FunctionParser(this.#mathFunction);
        this.#graphColumn.clearPoints(-xRange, xRange, -yRange, yRange);

        for (let x = minX; x < maxX; x++) {
            const y = this.#functionParser.evaluate(x);
            if (y === null) {
                this.#graphColumn.clearPoints(-xRange, xRange, -yRange, yRange);
                this.#graphColumn.renderPoints();
                return;
            }
            this.#graphColumn.addPoint(x, y);
        }

        this.#graphColumn.renderPoints();
    }
}