import { Coordinate } from '../coordinate';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import { Square } from './square';

export class SquareSolid extends Square {

    get name(): string {
        return "Square Solid";
    }
    
    get icon(): any {
        return faSquare;
    }
    draw(ctx: CanvasRenderingContext2D, start: Coordinate, width: number, height: number) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.start.x, this.start.y, width, height);
    }

    setup() {
        this.div.style.backgroundColor = this.color;
    }
}