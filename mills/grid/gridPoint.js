export class GridPoint {
    x;
    y;
    occupied;
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.occupied = 0; // 1 az fehér 2 az fekete
    }
}