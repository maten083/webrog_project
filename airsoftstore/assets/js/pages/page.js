export class Page {
    name;
    body;
    title;

    constructor(name, title, body) {
        this.name = name;
        this.body = body;
        this.title = title;

        body.innerHTML = "";
        title.innerText = name;
    }

    show() {
        throw new Error("The show method has to be overridden.")
    }

    createImage(src, title = '', alt = title, id = '', classes = '') {
        const img = this.createElement('img', id, classes);
        img.title = title;
        img.alt = alt;
        img.src = 'assets/images/' + src;
        img.loading = "lazy"
        return img;
    }

    createElement(type = 'div', id = '', classes = '', content = '') {
        const elem = document.createElement(type);
        if (id !== '') elem.id = id;
        if (classes !== '') elem.className = classes;
        if (content !== '') elem.innerHTML = content;
        return elem;
    }
    displayFooter() {
        const elem = this.createElement('footer', '', '', `
        <p>&copy; 2023 Airsoft Store. All rights reserved.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce commodo orci ac mi rutrum, a tincidunt ex
            interdum. Nulla congue cursus cursus. Sed aliquet ipsum in congue consequat. Praesent id placerat magna.
            Aliquam eget felis urna. Curabitur vulputate scelerisque massa a congue. Etiam congue enim ut aliquet
            eleifend. Curabitur malesuada sollicitudin mi, id varius lectus convallis ac.</p>`);

        this.body.appendChild(elem);
    }
}