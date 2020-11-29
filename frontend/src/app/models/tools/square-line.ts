import { Coordinate } from '../coordinate';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { Square } from './square';
export class SquareLine extends Square {
    get name(): string {
        return "Square Line";
    }

    get icon(): any {
        return faSquare;
    }

    draw(ctx: CanvasRenderingContext2D, start: Coordinate, width: number, height: number) {
        ctx.strokeStyle = this.color.code;
        ctx.lineWidth = this.size.current;
        ctx.strokeRect(this.start.x, this.start.y, width, height);
    }

    setup() {
        this.div.style.backgroundColor = 'transparent';
    }
}