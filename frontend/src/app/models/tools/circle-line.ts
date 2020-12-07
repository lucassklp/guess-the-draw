import { Coordinate } from '../coordinate';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { Circle } from './circle';

export class CircleLine extends Circle {
    get name(): string {
        return "Circle Line"
    }
    get icon(): any {
        return faCircle;
    }
    setup() {
        this.ellipse.setAttribute('fill', "transparent");
    }
    
    draw(ctx: CanvasRenderingContext2D, center: Coordinate, width: number, height: number) {
        const kappa = .5522848,
            ox = (width / 2) * kappa, // control point offset horizontal
            oy = (height / 2) * kappa, // control point offset vertical
            xe = center.x + width,           // x-end
            ye = center.y + height,           // y-end
            xm = center.x + width / 2,       // x-middle
            ym = center.y + height / 2;       // y-middle
    
        ctx.lineWidth = this.size.current;
        ctx.strokeStyle = this.color.code;
        ctx.beginPath();
        ctx.moveTo(center.x, ym);
        ctx.bezierCurveTo(center.x, ym - oy, xm - ox, center.y, xm, center.y);
        ctx.bezierCurveTo(xm + ox, center.y, xe, ym - oy, xe, ym);
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        ctx.bezierCurveTo(xm - ox, ye, center.x, ym + oy, center.x, ym);
        ctx.stroke();
        ctx.closePath();
    }

}