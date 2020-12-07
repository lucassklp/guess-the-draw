import { Coordinate } from '../coordinate';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import { Square } from './square';
import { Color } from '../color';

export class SquareSolid extends Square {

    constructor(color: Color){
        super(color, { min: 0, max: 0, current: 0 })
    }

    get name(): string {
        return "Square Solid";
    }
    
    get icon(): any {
        return faSquare;
    }
    draw(ctx: CanvasRenderingContext2D, start: Coordinate, width: number, height: number) {
        ctx.fillStyle = this.color.code;
        ctx.fillRect(this.start.x, this.start.y, width, height);
    }

    setup() {
        this.div.style.backgroundColor = this.color.code;
    }
}