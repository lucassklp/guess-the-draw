import { Coordinate } from '../coordinate';

export abstract class Tool {
    constructor(protected color: string, protected size: number) {}
    
    setColor(color: string) {
      this.color = color;
    }

    setSize(size: number){
        this.size = size;
    }

    abstract get name(): string
    abstract get icon(): string

    abstract startDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement)
    abstract onDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement)
    abstract onEndDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement)
    abstract preview(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement)
}