import { Coordinate } from '../coordinate';
import { Tool } from './tool';

export class Circle extends Tool {
    get name(): string {
        return "Circle"
    }
    get icon(): any {
        return "";
    }
    startDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        throw new Error('Method not implemented.');
    }
    onDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        throw new Error('Method not implemented.');
    }
    onEndDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        throw new Error('Method not implemented.');
    }
    preview(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        throw new Error('Method not implemented.');
    }

}