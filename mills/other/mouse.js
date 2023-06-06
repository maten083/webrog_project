export class Mouse {
    onclick;
    ondrag;
    start;
    dragging;
    dragThreshold = 10;
    constructor(canvas) {
        this.ondrag = null;
        this.onclick = null;
        this.start = null;
        canvas.addEventListener('mousedown', function(event) {
            this.start = event;
            this.dragging = false;
        }.bind(this));
        canvas.addEventListener('mousemove', function(event) {
            if (this.start !== null) {
                if (Math.sqrt(Math.pow(this.start.clientX - event.clientX, 2)
                    + Math.pow(this.start.clientY - event.clientY, 2)) > 10) {
                    this.dragging = true;
                }
            }
        }.bind(this));
        canvas.addEventListener('mouseup', function(event) {
            if (this.dragging) {
                if (this.ondrag !== null) {
                    this.ondrag(this.start, event);
                }
            }
            else {
                if (this.onclick !== null) {
                    this.onclick(event);
                }
            }
        }.bind(this));
    }
}