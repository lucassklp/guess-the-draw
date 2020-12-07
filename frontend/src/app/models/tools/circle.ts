import { Tool } from './tool';
import { Coordinate, getRelativeCoordinate } from '../coordinate';

export abstract class Circle extends Tool {

    ellipse: SVGEllipseElement;
    svg: HTMLElement;
    start: Coordinate;
    currentBorder = 1;
    abstract get name(): string;
    abstract get icon();


    abstract setup();
    abstract draw(ctx: CanvasRenderingContext2D, start: Coordinate, width: number, height: number);

    startDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        this.start = mouse;
        this.ellipse = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
        this.svg = document.getElementById('svg');
        this.svg.style.zIndex = "1";
        this.svg.appendChild(this.ellipse);
        this.setup();

        this.ellipse.setAttribute('stroke', this.color.code);
        this.ellipse.setAttribute('stroke-width', this.getSize().toString());


        this.ellipse.setAttribute('cx', mouse.x.toString());
        this.ellipse.setAttribute('cy', mouse.y.toString());
        this.ellipse.setAttribute('rx', "0");
        this.ellipse.setAttribute('ry', "0");
      
        this.ellipse.onmousemove = (ev) => {
            this.onDrawing(ctx, getRelativeCoordinate(ev, canvas), canvas)
        }
        this.ellipse.onmouseup = (ev) => {
            this.onEndDrawing(ctx, getRelativeCoordinate(ev, canvas), canvas)
        }
        this.svg.onmouseup = (ev) => {
            this.onEndDrawing(ctx, getRelativeCoordinate(ev, canvas), canvas)
        }
        this.svg.onmousemove = (ev) => {
            this.onDrawing(ctx, getRelativeCoordinate(ev, canvas), canvas)
        }
    }

    onDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        const width = mouse.x - this.start.x;
        const height = mouse.y - this.start.y;
        this.ellipse.setAttribute('cx', (mouse.x - width / 2).toString());
        this.ellipse.setAttribute('cy', (mouse.y - height / 2).toString());
        this.ellipse.setAttribute('rx', Math.abs(width / 2).toString());
        this.ellipse.setAttribute('ry', Math.abs(height / 2).toString());
    }

    onEndDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        const width = mouse.x - this.start.x;
        const height = mouse.y - this.start.y;
        this.ellipse.remove();
        this.svg.style.zIndex = "0";
        this.draw(ctx, this.start, width, height);
    }

    preview(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        return;
    }

}