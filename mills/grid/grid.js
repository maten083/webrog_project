import {GridPoint} from "./gridPoint.js";
import {Mouse} from "../other/mouse.js";

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
    mouse;
    now = 1;
    take = false;
    whiteDown = 0;
    blackDown = 0;
    message = "Fehér rak le egy pontot!";
    map;
    constructor(canvas, context, map) {
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
        context.font = "20px serif";
        this.context = context;
        this.map = map;
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
        this.mouse = new Mouse(this.canvas);
        this.mouse.onclick = function(event) {
            this.click(event);
            this.finishInput();
        }.bind(this);
        this.mouse.ondrag = function(start, finish) {
            this.drag(start, finish);
            this.finishInput();
        }.bind(this);
        this.showPoints();
    }
    click(event) {
        const x = event.clientX - this.bounding.left;
        const y = event.clientY - this.bounding.top;
        let clicked = this.findPoint(x, y);
        if (clicked !== null) {
            if (this.take) {
                if (clicked.occupied !== 0 && clicked.occupied !== this.now && !this.pointInMill(clicked)) {
                    clicked.occupied = 0;
                    this.take = false;
                    this.switchNow();
                }
            }
            else {
                if (this.now === 1 && this.whiteDown < 9 && clicked.occupied === 0) {
                    clicked.occupied = 1;
                    this.whiteDown += 1;

                    this.take = this.hasMills(clicked);
                    if (!this.take) {
                        this.switchNow();
                    }
                    else {
                        this.message = "Fehér vesz le egy feketét!"
                    }
                } else if (this.now === 2 && this.blackDown < 9 && clicked.occupied === 0) {
                    clicked.occupied = 2;
                    this.blackDown += 1;
                    this.take = this.hasMills(clicked);
                    if (!this.take) {
                        this.switchNow();
                    }
                    else {
                        this.message = "Fekete vesz le egy fehéret!"
                    }
                }
            }
            this.showPoints();
        }
    }
    drag(start, finish) {
        const xStart = start.clientX - this.bounding.left;
        const yStart = start.clientY - this.bounding.top;
        const xFinish = finish.clientX - this.bounding.left;
        const yFinish = finish.clientY - this.bounding.top;
        const startPoint = this.findPoint(xStart, yStart);
        const finishPoint = this.findPoint(xFinish, yFinish);
        if (startPoint !== null && finishPoint !== null) {
            if (this.isNeighbouring(startPoint, finishPoint)
                && startPoint.occupied === this.now
                && finishPoint.occupied === 0) {
                if (this.now === 1 && this.whiteDown === 9 || this.now === 2 && this.blackDown === 9) {
                    finishPoint.occupied = this.now;
                    startPoint.occupied = 0;
                    this.checkFromMills(startPoint);
                    this.take = this.hasMills(finishPoint);

                    if (!this.take) {
                        this.switchNow();
                    }
                    else {
                        if (this.now === 1) {
                            this.message = "Fehér vesz le egy feketét!"
                        }
                        else {
                            this.message = "Fekete vesz le egy fehéret!"
                        }
                    }
                }
            }
        }
        this.showPoints();
    }
    finishInput() {
        if (this.whiteDown === 9 && this.whiteNowDown() < 3) {
            this.message = "Fekete nyert!";
            this.mouse.onclick = null;
            this.mouse.ondrag = null;
            this.showPoints();
        }
        else if (this.blackDown === 9 && this.blackNowDown() < 3) {
            this.message = "Fehér nyert!";
            this.mouse.onclick = null;
            this.mouse.ondrag = null;
            this.showPoints();
        }
    }
    showPoints() {
        this.context.drawImage(this.map, 0, 0);
        this.context.fillStyle = "black";
        this.context.fillText(this.message, 5, 20);
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
    checkFromMills(start) {
        for (let i = 0; i < this.untilNow.length; i++) {
            if (this.untilNow[i].includes(start)) {
                this.untilNow.splice(i, 1);
                return;
            }
        }
    }
    pointInMill(point){
        for (const mill of this.untilNow) {
            for (const millPoint of mill) {
                if (point.x === millPoint.x && point.y === millPoint.y) {
                    return true;
                }
            }
        }
        return false;
    }
    whiteNowDown() {
        let amount = 0;
        for (const point of this.points) {
            if (point.occupied === 1) {
                amount += 1;
            }
        }
        return amount;
    }
    blackNowDown() {
        let amount = 0;
        for (const point of this.points) {
            if (point.occupied === 2) {
                amount += 1;
            }
        }
        return amount;
    }
    hasMills(clicked) {
        const row = [clicked];
        const column = [clicked];
        for (const point of this.points) {
            if (this.isInRow(clicked, point) && point.occupied === clicked.occupied && point !== clicked) {
                if (point.x === clicked.x) {
                    row.push(point);
                }
                else {
                    column.push(point);
                }
            }
        }

        if (row.length === 3) {
            this.untilNow.push(row);
            return true;
        }

        if (column.length === 3) {
            this.untilNow.push(column);
            return true;
        }
        return false;
    }
    switchNow() {
        if (this.now === 1) {
            this.now = 2;
            if (this.blackDown < 9) {
                this.message = "Fekete rak le egy pontot!";
            }
            else {
                this.message = "Fekete mozgatja az egyik pontját!";
            }
        }
        else {
            this.now = 1;
            if (this.whiteDown < 9) {
                this.message = "Fehér rak le egy pontot!";
            }
            else {
                this.message = "Fehér mozgatja az egyik pontját!";
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
    findPoint(x, y) {
        for (const point of this.points) {
            const distanceX = Math.sqrt(Math.pow(point.x - x, 2));
            const distanceY = Math.sqrt(Math.pow(point.y - y, 2));
            if (distanceX + distanceY <= 50) {
                return point;
            }
        }
        return null;
    }
    isNeighbouring(a, b) {
        const pointIndex = this.getPointIndex(a, b);
        const indA = pointIndex.a;
        const indB = pointIndex.b;
        if (indA === -1 || indB === -1) return false;
        // egymás mellett vannak, de lehet, hogy a közepénél, két szélénél, ezért ezt is meg kell vizsgálni
        // 0 1 2    3 4 5
        // vagy ugyan ez, csak függőlegesen
        if (Math.abs(indA - indB) === 1) {
            // ha indA nagyobb, mint indB, akkor az indA lehet a 3, indB lehet a 2, akkor nem jó
            // ugyan ez fordítva, ha indB nagyobb és az a 3, A pedig 2, az se jó
            if (indA > indB && indA === 3 && indB === 2) return false;
            if (indA < indB && indA === 2 && indB === 3) return false;
            return true;
        }
        return false;
    }
    isInRow(a, b) {
        const pointIndex = this.getPointIndex(a, b);
        const indA = pointIndex.a;
        const indB = pointIndex.b;
        if (indA === -1 || indB === -1) return false;
        if (indA === indB) return true;
        if ((indA >= 3 && indB < 3) || (indA < 3 && indB >= 3)) return false;
        return true;
    }
    getPointIndex(a, b) {
        const points = [];
        if (a.x === b.x) {
            for (const point of this.points) {
                if (a.x === point.x) {
                    points.push(point);
                }
            }
            points.sort(function (c, d) {
                return c.x - d.x;
            });
        }
        else if (a.y === b.y) {
            for (const point of this.points) {
                if (a.y === point.y) {
                    points.push(point);
                }
            }
            points.sort(function (c, d) {
                return c.y - d.y;
            });
        }
        const indA = points.indexOf(a);
        const indB = points.indexOf(b);

        return {
            a: indA,
            b: indB
        };
    }

}