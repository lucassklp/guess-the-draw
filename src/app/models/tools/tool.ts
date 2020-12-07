import { Color } from '../color';
import { Coordinate } from '../coordinate';
import { ToolSize } from '../tool.size';

export abstract class Tool {
    constructor(protected color: Color, protected size: ToolSize) {}
    
    public setColor(color: Color) {
      this.color = color;
    }

    public setSize(size: number | string){
      this.size.current = parseInt(size.toString());
    }

    public getSize(): number {
      return this.size.current;
    }

    public getMinSize(): number {
      return this.size.min;
    }
    
    public getMaxSize(): number {
      return this.size.max;
    }
    abstract get name(): string
    abstract get icon(): any

    abstract startDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement)
    abstract onDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement)
    abstract onEndDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement)
    abstract preview(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement)
}