
import {Methods} from './method.js';
import {CalculatorButton} from "./calculatorButton.js";

export class Calculator {
    /**
     *
     * @type {CalculatorButton[]}
     */
    calcButtons = [];
    /**
     * @type {HTMLSpanElement}
     */
    calcText;

    constructor() {
        this.calcButtons = [
            new CalculatorButton("C", this.resetToStart, "C", "c"),
            new CalculatorButton("<-", this.deleteOneNum, "<-", "Backspace"),
            new CalculatorButton("e", Methods.evalState, "e", "e"),
            new CalculatorButton("π", Methods.evalState),
            new CalculatorButton("x²", Methods.evalState, "x^2"),
            new CalculatorButton("10<sup>x</sup>", Methods.evalState, "10^x"),
            new CalculatorButton("xⁿ", Methods.pushState, "x^y"),
            new CalculatorButton("1/x", Methods.evalState),
            new CalculatorButton("mod", Methods.pushState, "mod", "%"),
            new CalculatorButton("n!", Methods.evalState, "!"),
            new CalculatorButton("lg", Methods.evalState),
            new CalculatorButton("rand", Methods.evalState),
            new CalculatorButton("|x|", Methods.evalState),
            new CalculatorButton("log₂x", Methods.evalState, "log2x"),
            new CalculatorButton("logₓy", Methods.pushState, "logxY"),
            new CalculatorButton("+", Methods.pushState, "+", "+"),
        ];
        let extraItems = [
            new CalculatorButton("-", Methods.pushState, "-", "-"),
            new CalculatorButton("*", Methods.pushState, "*", "*"),
            new CalculatorButton("/", Methods.pushState, "/", "/"),
        ]
        for (let i = 9; i > 0; i--) {
            this.calcButtons.push(new CalculatorButton(`${i}`, this.addNumber, i, `${i}`));
            if (i % 3 === 1 && i !== 9) {
                this.calcButtons.push(extraItems[Math.floor((i - 1) / 3)]);
            }
        }
        this.calcButtons.push(new CalculatorButton("+/-", this.negate));
        this.calcButtons.push(new CalculatorButton("0", this.addNumber, 0, "0"));
        this.calcButtons.push(new CalculatorButton(".", this.addNumber, '.', '.|,'));
        this.calcButtons.push(new CalculatorButton(`=`, Methods.evalEquals, '=', 'Enter'));
    }
    init(){
        const body = document.querySelector("body");

        let wholeBox = document.createElement("div");
        let titleBox = document.createElement("div");
        let title = document.createElement("h1");
        title.innerText = "Calculator";
        let previousNumber = document.createElement("h2");
        previousNumber.innerText = "Previous Number: 0";

        let calcBox = document.createElement("div");
        this.calcText = document.createElement("span");
        this.calcText.innerText = '0';

        let calcTable = document.createElement("table");

        let maxRows = 8;
        let maxColumns = Math.ceil(this.calcButtons.length / maxRows);

        for (let i = 0; i < maxRows; i++) {
            let calcRow = document.createElement("tr");

            for (let j = 0; j < maxColumns; j++) {
                let index = i * maxColumns + j;

                if (index >= this.calcButtons.length) break;

                const currentButton = this.calcButtons[index];

                const calcCell = document.createElement('td');
                calcCell.className = "border"
                const button = document.createElement('button');
                button.innerHTML = currentButton.name;
                button.className = 'w-full p-2 bg-slate-300 hover:bg-slate-400 rounded';

                button.addEventListener('click', () => {
                    const value = this.calcText.innerText.length === 0 ? 0 : parseFloat(this.calcText.innerText);
                    const result = currentButton.click.bind(this, value, currentButton.param)();
                    previousNumber.innerText = `Previous Number: ${Methods.previousNumber ?? 0}`;

                    if (result) {
                        this.calcText.innerText = `${result}`;
                    } else if (result !== false) {
                        this.calcText.innerText = '0';
                    }
                });
                currentButton.setElement(button);

                calcCell.appendChild(button);
                calcRow.appendChild(calcCell);

            }

            calcTable.appendChild(calcRow);
        }

        wholeBox.className = "bg-slate-200 text-lg w-max self-center m-auto mt-40 font-mono p-3";
        titleBox.className = "ml-3 mb-2";
        this.calcText.className = "mx-3 bg-white block p-2";
        calcTable.className = "border-separate border-spacing-2 w-full";

        titleBox.appendChild(title);
        titleBox.appendChild(previousNumber)

        calcBox.appendChild(this.calcText);
        calcBox.appendChild(calcTable);

        wholeBox.appendChild(titleBox);
        wholeBox.appendChild(calcBox);

        body.appendChild(wholeBox);

        document.addEventListener('keydown', e => {
            for (const item of this.calcButtons) {
                if (item.keymap !== null && item.keymap.split('|').includes(e.key)) {
                    item.element.click();
                }
            }
        })
    }
    negate() {
        if (this.calcText.innerText[0] !== '-')
            this.calcText.innerText = '-' + this.calcText.innerText;
        else
            this.calcText.innerText = this.calcText.innerText.substring(1);

        return false;
    }
    addNumber(_, number) {
        if (this.calcText.innerText === '0')
            this.calcText.innerText = `${number}`;
        else
            this.calcText.innerText += `${number}`;

        return false;
    }
    deleteOneNum() {
        if(this.calcText.innerText.length > 1)
        {
            return this.calcText.innerText.substring(0,this.calcText.innerText.length-1);
        }else{
            return "0";
        }
    }
    resetToStart() {
        Methods.previousNumber = null;
        Methods.currentState = null;
        this.calcText.innerText = "0";

    }
}
