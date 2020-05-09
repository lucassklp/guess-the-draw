import { Tool } from './tool';
import { Coordinate } from '../coordinate';

export class SquareLine extends Tool {

    div: HTMLDivElement
    start: Coordinate;
    get name(): string {
        return "Square Line"
    }
    get icon(): string {
        return "Square Line Icon"
    }
    startDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        this.div = document.getElementById("canvasContainer").appendChild(document.createElement('div'));
        this.start = mouse;
        this.div.style.position = 'absolute';
        this.div.style.top = `${mouse.y}px`
        this.div.style.left = `${mouse.x}px`
        this.div.style.borderColor = this.color;
        this.div.style.borderWidth = `${this.size}px`;
        this.div.style.borderStyle = `solid`;
        this.div.style.backgroundColor = 'transparent';
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

        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.strokeRect(this.start.x, this.start.y, width, height);
        
    }
    preview(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        return;
    }

}