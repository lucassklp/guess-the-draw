import { Coordinate } from '../coordinate';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { Circle } from './circle';
import { Color } from '../color';

export class CircleSolid extends Circle {

    constructor(color: Color){
        super(color, { min: 0, max: 0, current: 0 })
    }

    get name(): string {
        return "Circle Solid"
    }
    get icon(): any {
        return faCircle;
    }
    setup() {
        this.ellipse.setAttribute('fill', this.color.code);
    }
    
    draw(ctx: CanvasRenderingContext2D, center: Coordinate, width: number, height: number) {
        const kappa = .5522848,
            ox = Math.abs(width) * kappa, // control point offset horizontal
            oy = Math.abs(height) * kappa, // control point offset vertical
            xe = center.x + width,           // x-end
            ye = center.y + height,           // y-end
            xm = center.x + width / 2,       // x-middle
            ym = center.y + height / 2;       // y-middle


        ctx.lineWidth = this.size.current;
        ctx.strokeStyle = this.color.code;
        ctx.fillStyle = this.color.code;
        ctx.beginPath();
        ctx.ellipse(xm, ym, ox, oy, Math.PI, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }

}