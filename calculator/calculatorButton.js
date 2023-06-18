export class CalculatorButton {
    name;
    click;
    param;
    keymap;
    element;

    constructor(name, click, param = name, keymap = null) {
        this.name = name;
        this.click = click;
        this.param = param;
        this.keymap = keymap;
    }

    setElement(element) {
        this.element = element;
    }
}