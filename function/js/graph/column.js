export class Column {
    functionGraph;
    /**
     * @param {FunctionGraph} functionGraph
     */
    constructor(functionGraph) {
        this.functionGraph = functionGraph;
    }

    /**
     * @returns {HTMLElement}
     */
    render() {
        throw new Error("The render method has to be overridden.");
    }
}