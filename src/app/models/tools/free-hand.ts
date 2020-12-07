import { Tool } from './tool';
import { Coordinate } from '../coordinate';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

export class FreeHand extends Tool {
    get name(): string {
      return "Free Hand"
    }
    get icon() {
      return faPencilAlt
    }
  
    startDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
    }
  
    onDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
      ctx.lineTo(mouse.x, mouse.y);
      ctx.strokeStyle = this.color.code;
      ctx.lineWidth = this.size.current;
      ctx.stroke();
    }
    onEndDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
  
    }

    preview(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
    }
  }