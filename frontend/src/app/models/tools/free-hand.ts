import { Tool } from './tool';
import { Coordinate } from '../coordinate';

export class FreeHand extends Tool {
    get name(): string {
      return "Free Hand"
    }
    get icon(): string {
      return "Free hand icon"
    }
  
    startDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
    }
  
    onDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
      ctx.lineTo(mouse.x, mouse.y);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.size;
      ctx.stroke();
    }
    onEndDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
  
    }

    preview(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
    }
  }