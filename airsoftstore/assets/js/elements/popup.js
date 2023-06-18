export class Modal {
    id = '';
    title = '';
    content = '';
    popup = null;

    constructor(id, title, content) {
        this.id = id;
        this.title = title;
        this.content = content;
    }
    compile() {
        this.popup = document.createElement('div');
        this.popup.id = this.id;
        this.popup.className = 'popup';

        const popupContentWrapper = document.createElement('div');
        popupContentWrapper.className = 'popup-content';

        const popupTitle = document.createElement('h3');
        popupTitle.textContent = this.title;
        popupContentWrapper.appendChild(popupTitle);
        
        const popupContent = document.createElement('p');
        popupContent.textContent = this.content;
        popupContentWrapper.appendChild(popupContent);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.addEventListener('click', () => {
            this.hide();
        });
        popupContentWrapper.appendChild(closeBtn);

        this.popup.appendChild(popupContentWrapper);

        return this.popup;
    }

    show() {
        this.popup.style.display = 'flex';
    }
    hide() {
        this.popup.style.display = 'none';
    }
}