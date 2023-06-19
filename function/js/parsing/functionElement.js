export class FunctionElement {
    /**
     * The method to search for in the user input
     * @type {string}
     */
    element = 'sin';
    /**
     * The evaluation method
     * @type {((x: number) => number)|((x: number, y: number) => number)|null}
     */
    evaluation = null;
    /**
     * The order of the operation
     * @type {number}
     */
    order = 1;

    /**
     * Create a new function element
     * @param {string} element the name of the operation to search for in the user input string
     * @param {((x: number) => number)|((x: number, y: number) => number)} evaluation the method of the operation
     * @param {number} order the precedence of the operation
     */
    constructor(element, evaluation, order = 1) {
        this.element = element;
        this.evaluation = evaluation;
        this.order = order;
    }

    /**
     * Check whether the FunctionElement is valid and properly initialized
     * @returns {boolean}
     */
    get isValid() {
        return this.evaluation !== null;
    }
}