import { Tool } from './tool';
import { Coordinate, getRelativeCoordinate } from '../models/coordinate';

export abstract class Square extends Tool {

    div: HTMLDivElement
    start: Coordinate;
    abstract get name(): string;
    abstract get icon();


    abstract setup();
    abstract draw(ctx: CanvasRenderingContext2D, start: Coordinate, width: number, height: number);

    startDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        this.div = document.getElementById("canvasContainer").appendChild(document.createElement('div'));
        this.start = mouse;
        this.setup();
        this.div.style.position = 'absolute';
        this.div.style.top = `${mouse.y}px`
        this.div.style.left = `${mouse.x}px`

        this.div.style.borderColor = this.color.code;
        this.div.style.borderWidth = `${this.getSize()}px`;

        this.div.style.borderStyle = `solid`;
        this.div.style.boxSizing = 'border-box';
        this.div.onmousemove = (ev) => {
            this.onDrawing(ctx, getRelativeCoordinate(ev, canvas), canvas)
        }
        this.div.onmouseup = (ev) => {
            this.onEndDrawing(ctx, getRelativeCoordinate(ev, canvas), canvas)
        }
    }

    onDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        const width = (mouse.x - this.start.x) + this.getSize() / 2;
        const height = (mouse.y - this.start.y) + this.getSize() / 2;

        // console.log(width)
        // console.log(height)
        // console.log(mouse)
        console.log(this.size);
        this.div.style.borderStyle = `solid`;
        this.div.style.boxSizing = 'border-box';
        this.div.style.borderColor = this.color.code;
        this.div.style.borderWidth = `${this.getSize()}px`;

        if(width >= 0 && height >= 0){
            this.div.style.top = `${this.start.y}px`
            this.div.style.left = `${this.start.x}px`
            this.div.style.width = `${width}px`
            this.div.style.height = `${height}px`
        }
        else if(width < 0 && height < 0){
            this.div.style.top = `${this.start.y - Math.abs(height)}px`
            this.div.style.left = `${this.start.x - Math.abs(width)}px`
            this.div.style.width = `${Math.abs(width)}px`
            this.div.style.height = `${Math.abs(height)}px`
        }
        else if(width > 0 && height < 0){
            this.div.style.top = `${this.start.y - Math.abs(height)}px`
            this.div.style.left = `${this.start.x}px`
            this.div.style.width = `${Math.abs(width)}px`
            this.div.style.height = `${Math.abs(height)}px`
        }
        else{
            this.div.style.top = `${this.start.y}px`
            this.div.style.left = `${this.start.x - Math.abs(width)}px`
            this.div.style.width = `${Math.abs(width)}px`
            this.div.style.height = `${Math.abs(height)}px` 
        }
    }

    onEndDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        const width = mouse.x - this.start.x;
        const height = mouse.y - this.start.y;
        this.div.remove();
        this.draw(ctx, this.start, width, height)
    }

    preview(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        return;
    }

}