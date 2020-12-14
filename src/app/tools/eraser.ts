import { Tool } from './tool';
import { Coordinate, getRelativeCoordinate } from '../models/coordinate';
import { faEraser } from '@fortawesome/free-solid-svg-icons';

export class Eraser extends Tool {
    private eraserDiv: HTMLDivElement;

    get name(): string {
        return "Eraser"
    }
    get icon() {
        return faEraser;
    }
    startDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        this.erase(ctx, mouse);
    }
    onDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        this.erase(ctx, mouse);
    }
    onEndDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        this.erase(ctx, mouse);
    }

    private erase(ctx: CanvasRenderingContext2D, mouse: Coordinate){
        ctx.fillStyle = this.color.code;
        ctx.fillRect(mouse.x - this.size.current/2 , mouse.y - this.size.current / 2, this.size.current, this.size.current);
    }

    preview(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        let draw = (coord: Coordinate) => {
            this.eraserDiv.style.width = `${this.size.current}px`;
            this.eraserDiv.style.height = `${this.size.current}px`;
            this.eraserDiv.style.border = '1px solid black';
            this.eraserDiv.style.backgroundColor = this.color.code
            this.eraserDiv.style.top = `${coord.y - this.size.current / 2}px`;
            this.eraserDiv.style.left = `${coord.x - this.size.current / 2}px`;
        }
        
        if(!this.eraserDiv){
            let container = document.getElementById("canvasContainer")
            this.eraserDiv = container.appendChild(document.createElement("div") as HTMLDivElement);
            this.eraserDiv.style.position = "absolute";
            this.eraserDiv.style.zIndex = "2"
            this.eraserDiv.onmousemove = (ev: MouseEvent) => {
                let coord = getRelativeCoordinate(ev, canvas);
                draw(coord);
                canvas.onmousemove(ev);
            }
        }
        this.eraserDiv.onmousedown = canvas.onmousedown;
        this.eraserDiv.onmouseup = canvas.onmouseup;
        draw(mouse);
        let rect = canvas.getBoundingClientRect()
        if(mouse.x < this.size.current / 2 || mouse.x > rect.right - rect.left || mouse.y < this.size.current / 2 || mouse.y > rect.bottom) {
            this.eraserDiv.style.display = "none";
        }
        else{
            this.eraserDiv.style.display = "block";
        }
    }
}