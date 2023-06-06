import {GridPoint} from "./gridPoint.js";

export class Grid {
    // Az összes táblán lévő pont
    points;
    // Az eddig 1 sorban, vagy 1 oszlopban lévő pontok
    untilNow;
    canvas;
    context;
    black;
    white;
    bounding;
    now = 1;
    take = false;
    constructor(canvas, context) {
        this.points = [
            // első sor
            new GridPoint(75, 75),
            new GridPoint(300, 75),
            new GridPoint(524, 75),
            // második sor
            new GridPoint(150, 150),
            new GridPoint(300, 150),
            new GridPoint(449, 150),
            // harmadik sor
            new GridPoint(225, 225),
            new GridPoint(300, 225),
            new GridPoint(374, 225),
            // negyedik sor
            new GridPoint(75, 300),
            new GridPoint(150, 300),
            new GridPoint(225, 300),
            new GridPoint(300, 300),
            new GridPoint(374, 300),
            new GridPoint(449, 300),
            new GridPoint(524, 300),
            // ötödik sor
            new GridPoint(225, 374),
            new GridPoint(300, 374),
            new GridPoint(374, 374),
            // hatodik sor
            new GridPoint(150, 449),
            new GridPoint(300, 449),
            new GridPoint(449, 449),
            // hetedik sor
            new GridPoint(75, 524),
            new GridPoint(300, 524),
            new GridPoint(524, 524),
        ]
        this.untilNow = [];
        this.canvas = canvas;
        this.context = context;
        this.black = null;
        this.white = null;
        this.bounding = canvas.getBoundingClientRect();
        // bind(this) -> a jelenlegi példányra köti rá a funckiót, hogy lehessen változót módosítani benne (Grid-ben)
        this.loadImage('images/black.png', function(image) {
            this.black = image;
            if (this.black !== null && this.white !== null) {
                this.addListeners();
            }
        }.bind(this));
        this.loadImage('images/white.png', function(image) {
            this.white = image;
            if (this.black !== null && this.white !== null) {
                this.addListeners();
            }
        }.bind(this));
    }
    addListeners() {
        this.canvas.addEventListener('click', this.click.bind(this))
    }

    click(event) {
        const x = event.clientX - this.bounding.left;
        const y = event.clientY - this.bounding.top;

        let clicked = null;
        for (const point of this.points) {
            const distanceX = Math.sqrt(Math.pow(point.x - x, 2));
            const distanceY = Math.sqrt(Math.pow(point.y - y, 2));
            if (distanceX + distanceY <= 10) {
                clicked = point;
                break;
            }
        }
        if (clicked !== null) {
            clicked.occupied = this.now;

            if (this.now === 1) {
                this.now = 2;
            }
            else {
                this.now = 1;
            }

            this.showPoints();
        }

    }
    showPoints() {
        for (const point of this.points) {
            if (point.occupied !== 0) {
                if (point.occupied === 1) {
                    this.context.drawImage(this.white, point.x - this.white.width / 2, point.y - this.white.height / 2);
                }
                else {
                    this.context.drawImage(this.black, point.x - this.black.width / 2, point.y - this.black.height / 2);
                }
            }
        }
    }
    loadImage(src, then) {
        const image = new Image();
        image.addEventListener('load', function () {
            then(image);
        })
        image.src = src;
    }
}