import { Tool } from './tool';
import { Coordinate } from '../models/coordinate';
import { faFill } from '@fortawesome/free-solid-svg-icons';
import { Color } from '../models/color';
import { PixelData } from '../models/pixel-data';
export class PaintBucket extends Tool {

    constructor(color: Color){
      super(color, { min: 0, max: 0, current: 0 })
    }

    get name(): string {
        return "Paint bucket"
    }
    get icon() {
        return faFill;
    }

    startDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
        this.floodFill(ctx, mouse, this.color);
    }

    onDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
    }
    onEndDrawing(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
    }
    preview(ctx: CanvasRenderingContext2D, mouse: Coordinate, canvas: HTMLCanvasElement) {
    }

    private getPixel(pixelData: PixelData, coordinate: Coordinate) : number {
        const x = coordinate.x;
        const y = coordinate.y;
        if (x < 0 || y < 0 || x >= pixelData.width || y >= pixelData.height) {
          return -1;
        } else {
          return pixelData.data[y * pixelData.width + x];
        }
    }

    private floodFill(ctx: CanvasRenderingContext2D, coordinate: Coordinate, fillColor: Color) {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        const pixelData = {
          width: imageData.width,
          height: imageData.height,
          data: new Uint32Array(imageData.data.buffer),
        };
        
        const targetColor = this.getPixel(pixelData, coordinate);

        if (targetColor !== fillColor.hex) {
          const pixelsToCheck: Coordinate[] = [coordinate];
          while (pixelsToCheck.length > 0) {
            const pixel = pixelsToCheck.pop();
            const currentColor = this.getPixel(pixelData, pixel);
            if (currentColor === targetColor) {
              pixelData.data[pixel.y * pixelData.width + pixel.x] = fillColor.hex;
              pixelsToCheck.push({x: pixel.x + 1, y: pixel.y});
              pixelsToCheck.push({x: pixel.x - 1, y: pixel.y});
              pixelsToCheck.push({x: pixel.x, y: pixel.y + 1});
              pixelsToCheck.push({x: pixel.x, y: pixel.y - 1});
            }
          }
          ctx.putImageData(imageData, 0, 0);
        }
    }
}