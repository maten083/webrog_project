import {Grid} from "./grid/grid.js";

export class Mills {
    canvas;
    context;
    map;
    grid;
    constructor() {
        this.canvas = document.createElement('canvas');
        this.loadMap(() => {
            this.canvas.setAttribute('width', this.map.width + "");
            this.canvas.setAttribute('height', this.map.height + "");
            this.canvas.style.border = '2px solid black';
            this.context = this.canvas.getContext('2d');
            document.body.appendChild(this.canvas);
            this.context.drawImage(this.map, 0, 0);
            this.grid = new Grid(this.canvas, this.context, this.map);
        })
    }
    loadMap(then) {
        this.map = new Image();
        this.map.addEventListener('load', function () {
            then();
        })
        this.map.src = 'images/map.png';
    }
}