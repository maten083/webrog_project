import {Column} from "./column.js";
import {FunctionParser} from "../parsing/functionParser.js";

export class InputColumn extends Column {
    /**
     * The input element where the user can input the math function
     * @type {HTMLInputElement}
     */
    #inputElement;

    /**
     * The range for the minimum X value
     * @type {HTMLInputElement}
     */
    #minXRange;
    /**
     * The range for the maximum X value
     * @type {HTMLInputElement}
     */
    #maxXRange;

    /**
     * The range for the minimum Y value
     * @type {HTMLInputElement}
     */
    #viewRangeY;
    /**
     * The range for the maximum Y value
     * @type {HTMLInputElement}
     */
    #viewRangeX;

    /**
     * Renders the Input column
     * @returns {HTMLElement}
     */
    render() {
        const container = document.createElement('div');
        container.classList.add('column-container');
        container.id = 'input-container';

        this.#createInputGroup(group => {
            const inputLabel = document.createElement('label');
            inputLabel.for = 'function-input';
            inputLabel.innerText = 'Function:';

            this.#inputElement = document.createElement('input');
            this.#inputElement.id = 'function-input';
            this.#inputElement.type = 'text';

            group.appendChild(inputLabel);
            group.appendChild(this.#inputElement);

            const disclaimer = document.createElement('p');
            disclaimer.innerHTML = 'Please surround methods with space. If you wish to add a negative number, do not put space.' +
                '<br />For example: -10 + -10. <br /> <br />';
            disclaimer.innerHTML += 'Available methods (Please do not write brackets): <br />';
            disclaimer.innerHTML += FunctionParser.functionElements.map(t => t.element).join(", ");

            group.appendChild(disclaimer);
        }, container);

        this.#createSeparator(container);

        this.#createInputGroup(group => {
            const toggleLabel = document.createElement('label');
            toggleLabel.for = 'deg-toggle';
            toggleLabel.innerText = 'Use degrees for trigonometric methods';

            const toggle = document.createElement('input');
            toggle.id = 'deg-toggle';
            toggle.type = 'checkbox';
            toggle.checked = FunctionParser.useDeg;
            toggle.addEventListener('change', () => {
                FunctionParser.useDeg = toggle.checked;
            })


            group.appendChild(toggleLabel);
            group.appendChild(toggle);
        }, container);

        this.#createSeparator(container);

        this.#createInputGroup(group => {
            this.#minXRange = this.#createRange("Min X", "min-x-range",
                '-1000', '0', group);
        }, container);

        this.#createInputGroup(group => {
            this.#maxXRange = this.#createRange("Max X", "max-x-range",
                '10', '1000', group);
        }, container);

        this.#createSeparator(container);

        this.#createInputGroup(group => {
            this.#viewRangeX = this.#createRange("X view range", "x-view-range",
                '10', '1000', group);
        }, container);

        this.#createInputGroup(group => {
            this.#viewRangeY = this.#createRange("Y view range", "y-view-range",
                '10', '1000', group);
        }, container);

        this.#createSeparator(container);

        this.#createInputGroup(group => {
            const calculateButton = document.createElement('button');
            calculateButton.innerText = 'Calculate';
            calculateButton.addEventListener('click', () => {
                this.functionGraph.setFunction(this.#inputElement.value);
                this.functionGraph.calculateFunction(this.minX, this.maxX, this.xRange, this.yRange);
            });
            group.appendChild(calculateButton);
        }, container);

        return container;
    }

    get minX() {
        return this.#minXRange.value;
    }
    get maxX() {
        return this.#maxXRange.value;
    }

    get xRange() {
        return this.#viewRangeX.value;
    }
    get yRange() {
        return this.#viewRangeY.value;
    }

    /**
     * Create an input group, where the inputs can be added
     *
     * @param {(element: HTMLElement) => void} callback the callback, having the form-group element to add the elements to
     * @param {HTMLElement} container the container
     */
    #createInputGroup(callback, container) {
        const formGroup = document.createElement('div');
        formGroup.classList.add('form-group');
        callback(formGroup);
        container.appendChild(formGroup);
    }

    /**
     * Creates a range
     *
     * @param {string} name The name of the range
     * @param {string} id The ID of the range
     * @param {string} min The minimum value for the range
     * @param {string} max The maximum value for the range
     * @param {HTMLElement} container The container
     */
    #createRange(name, id, min, max, container) {
        const rangeLabel = document.createElement('label')
        rangeLabel.setAttribute('for', id);

        const range = document.createElement('input');
        range.type = 'range';
        range.id = id;
        range.min = min
        range.max = max;
        range.value = Math.abs(parseInt(min)) > Math.abs(parseInt(max)) ? max : min;

        rangeLabel.innerText = `${name} (${range.value}): `;

        range.addEventListener('change', () => {
            rangeLabel.innerText = `${name} (${range.value}): `;
        })

        container.appendChild(rangeLabel);
        container.appendChild(range);

        return range;
    }

    /**
     * Create a separator in the container
     * @param {HTMLElement} container
     */
    #createSeparator(container) {
        const hr = document.createElement('hr');
        hr.style.width = "100%";
        container.appendChild(hr);
    }
}