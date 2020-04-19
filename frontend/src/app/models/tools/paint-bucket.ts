import { Tool } from './tool';
import { Coordinate } from '../coordinate';

export class PaintBucket extends Tool {
    get name(): string {
        return "Paint bucket"
    }
    get icon(): string {
        return "Paint bucket icon"
    }

    startDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        
    }
    onDrawing(ctx: CanvasRenderingContext2D, mouse: any, canvas: HTMLCanvasElement) {

    }
    onEndDrawing(ctx: CanvasRenderingContext2D, mouse: any, canvas: HTMLCanvasElement) {

    }

    preview(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement){

    }

}