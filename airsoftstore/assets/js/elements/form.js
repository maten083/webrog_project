export class Form {
    id = '';
    title = '';
    fields = [];

    constructor(id, title) {
        this.id = id;
        this.title = title;
    }

    addField(id, name, type = 'text', required = true, options = null) {
        this.fields.push({
            id: id,
            name: name,
            type: type,
            required: required,
            options: options
        });
        return this;
    }

    compile() {
        const form = document.createElement('form');
        form.id = this.id;

        const formTitle = document.createElement('h2');
        formTitle.textContent = this.title;
        form.appendChild(formTitle);

        this.fields.forEach((field) => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';

            const label = document.createElement('label');
            label.for = field.id;
            label.textContent = field.name;
            formGroup.appendChild(label);

            if (field.type === 'select') {
                const input = document.createElement('select');
                input.id = field.id;
                input.name = field.id;
                input.required = true;
    
                if (field.options !== null) {
                    field.options.forEach((option) => {
                        const optionElement = document.createElement('option');
    
                        optionElement.value = option.value ?? '';
                        optionElement.textContent = option.name ?? 'Option';
                        optionElement.selected = option.selected ?? false;
                        optionElement.disabled = option.disabled ?? false;
    
                        input.appendChild(optionElement);
                    });
                }
                formGroup.appendChild(input);
            } else {
                const input = document.createElement('input');
                input.id = field.id;
                input.name = field.id;
                input.type = field.type;
                input.required = true;
                formGroup.appendChild(input);
            }


            form.appendChild(formGroup);
        });

        return form;
    }
}