import { Tool } from './tool';
import { Coordinate, getRelativeCoordinate } from '../coordinate';

export class SquareSolid extends Tool {

    div: HTMLDivElement
    start: Coordinate;

    get name(): string {
        return "Square Solid"
    }
    get icon(): string {
        return "Square Solid Icon"
    }
    startDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        this.div = document.getElementById("canvasContainer").appendChild(document.createElement('div'));
        this.start = mouse;
        this.div.style.position = 'absolute';
        this.div.style.top = `${mouse.y}px`
        this.div.style.left = `${mouse.x}px`
        this.div.onmousemove = (ev: MouseEvent) => {
            let coord = getRelativeCoordinate(ev, canvas);
            console.log(`mousemove`);
            this.div.style.top = `${coord.y}px`
            this.div.style.left = `${coord.x}px`
        }
        this.div.style.backgroundColor = this.color;
    }

    onDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        let width = mouse.x - this.start.x;
        let height = mouse.y - this.start.y;

        this.div.style.width = `${width}px`
        this.div.style.height = `${height}px`
    }
    onEndDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        let width = mouse.x - this.start.x;
        let height = mouse.y - this.start.y;
        this.div.remove();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.start.x, this.start.y, width, height);
    }
    preview(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        return;
    }

}