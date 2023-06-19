import {Column} from "./column.js";

export class GraphColumn extends Column {
    /**
     * @type {{x: number, y: number}[]}
     */
    #points= [];
    /**
     * @type {HTMLElement}
     */
    #pointContainer;

    /**
     * The left value of the "bounding box" of the graph
     * @type {number|null}
     */
    #minX = null;
    /**
     * The right value of the "bounding box" of the graph
     * @type {number|null}
     */
    #maxX = null;
    /**
     * The bottom value of the "bounding box" of the graph
     * @type {number|null}
     */
    #minY = null;
    /**
     * The top value of the "bounding box" of the graph
     * @type {number|null}
     */
    #maxY= null;

    /**
     * Renders the graph column
     * @returns {HTMLElement}
     */
    render() {
        const container = document.createElement('div');
        container.classList.add('column-container');
        container.id = 'graph-container';

        this.#pointContainer = document.createElement('div');
        this.#pointContainer.id = 'point-container';
        container.appendChild(this.#pointContainer);

        return container;
    }

    /**
     * Clears all the points and resets the viewport
     *
     * @param {number} minX
     * @param {number} maxX
     * @param {number} minY
     * @param {number} maxY
     */
    clearPoints(minX, maxX, minY, maxY) {
        this.#points.length = 0;

        this.#minX = minX;
        this.#maxX = maxX;
        this.#minY = minY;
        this.#maxY = maxY;
    }

    /**
     * Adds a new point into the render-able points
     *
     * @param {number} x
     * @param {number} y
     */
    addPoint(x, y) {
        if (isNaN(y)) return;
        this.#points.push({
            x,
            y
        });
    }

    /**
     * Renders all the points that were set via addPoints
     */
    renderPoints() {
        this.#pointContainer.innerHTML = '';

        const rangeX = this.#maxX - this.#minX;
        const rangeY = this.#maxY - this.#minY;

        for (const {x, y} of this.#points) {
            const xCoordinate = ((x - this.#minX) / rangeX) * 100;
            const yCoordinate = 100 - ((y - this.#minY) / rangeY) * 100;

            const point = document.createElement('i');
            point.classList.add('point');

            //point.style.transform = `translate(${-50 + xCoordinate}%, ${-50 + yCoordinate}%)`;
            point.style.left = `${xCoordinate}%`;
            point.style.top = `${yCoordinate}%`;

            this.#pointContainer.appendChild(point);
        }
    }
}