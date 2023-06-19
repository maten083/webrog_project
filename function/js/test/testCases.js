import {TestCase} from "./testCase.js";

export class TestCases {
    /**
     * Expressions
     * @type {TestCase[]}
     */
    static #expressions = [
        new TestCase("2 + 2", 4),
        new TestCase("2 * 4", 8),
        new TestCase("12 / 3", 4),
        new TestCase("-10 * -10", 100),
        new TestCase("sin x", 1, 90),
    ];

    static render() {
        let container = document.getElementById('test-cases-container');
        let testCasesContainer = document.getElementById('test-cases');

        if (testCasesContainer === null) {
            container = document.createElement('div');
            container.id = 'test-cases-container';

            testCasesContainer = document.createElement('table');
            testCasesContainer.id = 'test-cases';

            container.appendChild(testCasesContainer);
            document.getElementsByTagName('body')[0].appendChild(container);

            const checkButton = document.createElement('button');
            checkButton.addEventListener('click', () => {
                TestCases.#checkAll();
            });
            checkButton.innerText = 'Run tests';
            container.appendChild(checkButton);
        }
        testCasesContainer.innerHTML = '';
        for (const testCase of TestCases.#expressions) {
            const testCaseContainer = document.createElement('tr');

            TestCases.#createNode('Expression', testCase.expression, testCaseContainer);
            TestCases.#createNode('Variable', `${testCase.variableValue ?? 'none'}`, testCaseContainer);
            TestCases.#createNode('Expected value', `${testCase.expectedValue}`, testCaseContainer);

            TestCases.#createNode('Completed', testCase.isCompleted ? "Yes" : "No", testCaseContainer);
            if (testCase.isCompleted) {
                TestCases.#createNode('Result', `${testCase.expressionResult}`, testCaseContainer);
                TestCases.#createNode('Success', testCase.isSuccess ? "Yes" : "No", testCaseContainer);
            }
            testCasesContainer.appendChild(testCaseContainer);
        }
    }

    static #checkAll() {
        for (const testCase of TestCases.#expressions) {
            testCase.validate();
        }

        this.render();
    }

    /**
     * Create a span node and fill it with content
     * @param {string} label the prefix for the value
     * @param {string} value the value
     * @param {HTMLElement} container the container where it should be added
     */
    static #createNode(label, value, container) {
        const expression = document.createElement('td');
        expression.innerText = `${label}: ${value}`;
        expression.style.marginRight = '4px';
        container.appendChild(expression);
    }
}