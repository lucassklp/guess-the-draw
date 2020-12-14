import { Tool } from './tool';
import { Coordinate } from '../models/coordinate';

export class Line extends Tool {
    get name(): string {
        return "Line"
    }
    get icon(): string {
        return "Line Icon"
    }

    startDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        throw new Error("Method not implemented.");
    }
    onDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        throw new Error("Method not implemented.");
    }
    onEndDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        throw new Error("Method not implemented.");
    }

    preview(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        throw new Error("Method not implemented.");
    }
}