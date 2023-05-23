import { Entity } from "./entity.js";
import {SnakeGame} from "../snakeGame.js";

export class Apple extends Entity {

    onEaten() {
        const isSuper = Math.random() > 0.8;

        const normalTexture = this.getMiddleTexture();
        const superTexture = this.getLastTexture();

        if (isSuper) {
            this.setTextures(superTexture, normalTexture, superTexture);
        } else {
            this.setTextures(normalTexture, normalTexture, superTexture);
        }

        this.#setRandomPosition();
    }
    #setRandomPosition() {
        this.getSegments()[0].setX(Math.random() * SnakeGame.variables.AREA_WIDTH)
        this.getSegments()[0].setY(Math.random() * SnakeGame.variables.AREA_HEIGHT)
    }
}