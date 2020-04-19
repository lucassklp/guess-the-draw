import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FreeHand } from '../models/tools/free-hand';
import { Tool } from '../models/tools/tool';
import { Coordinate, getRelativeCoordinate } from '../models/coordinate';
import { Eraser } from '../models/tools/eraser';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GameComponent implements OnInit {

  coordinate: Coordinate = {x: 0, y: 0}
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  
  tools: Tool[];
  tool: Tool;
  selectedSize = 10;

  colors = ['#333', '#2ecc71', '#3498db', '#e74c3c', '#8e44ad', '#ecf0f1', '#f39c12', '#bdc3c7', '#f1c40f']
  selectedColor: string;

  historic: string[]

  constructor() {
    this.historic = [];
    this.selectedColor = this.colors[0];
    this.tools = [
      new FreeHand(this.selectedColor, 10),
      new Eraser(this.selectedColor, 100),
    ]
    this.tool = this.tools[0];
  }

  ngOnInit(): void {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    
    let drawing = false;
    if (this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d');
      const rect = this.canvas.getBoundingClientRect();

      this.canvas.width = rect.right - rect.left;
      this.canvas.height = rect.bottom - rect.top;

      this.canvas.onmousedown = (ev: MouseEvent) => {
        drawing = true;
        this.historic.push(this.canvas.toDataURL());
        this.tool.startDrawing(this.ctx, getRelativeCoordinate(ev, this.canvas), this.canvas);
      }

      this.canvas.onmousemove = (ev: MouseEvent) => {
        this.coordinate = getRelativeCoordinate(ev, this.canvas);
        this.tool.preview(this.ctx, this.coordinate, this.canvas);
        if(drawing){
          this.tool.onDrawing(this.ctx, this.coordinate, this.canvas);
        }
      }

      this.canvas.onmouseup = (ev: MouseEvent) => {
        drawing = false;
        this.tool.onEndDrawing(this.ctx, this.coordinate, this.canvas)
      }
    }
  }

  setSize(size: number){
    this.selectedSize = size;
    this.tool.setSize(size)
  }

  public setColor(color: string){
    this.selectedColor = color;
    this.tool.setColor(color);
  }

  setTool(tool: Tool){
    this.tool = tool;
    this.setColor(this.selectedColor);
    this.setSize(this.selectedSize);
  }

  undo(){
    let img = new Image;
    img.onload = () => {
      this.ctx.drawImage(img,0,0);
    };
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    img.src = this.historic.pop();
    this.ngOnInit();
  }
}
