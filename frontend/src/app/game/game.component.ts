import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FreeHand } from '../models/tools/free-hand';
import { Tool } from '../models/tools/tool';
import { Coordinate, getRelativeCoordinate } from '../models/coordinate';
import { Eraser } from '../models/tools/eraser';
import { SquareLine } from '../models/tools/square-line';
import { SquareSolid } from '../models/tools/square-solid';
import { faRedo, faUndo, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GameComponent implements OnInit {
  faUndo = faUndo;
  faRedo = faRedo;
  faTrash = faTrash
  coordinate: Coordinate = {x: 0, y: 0}
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  
  tools: Tool[];
  currentTool: Tool;
  selectedSize = 10;

  colors = ['#333', '#fff', '#2ecc71', '#3498db', '#e74c3c', '#8e44ad', '#ecf0f1', '#f39c12', '#bdc3c7', '#f1c40f']
  selectedColor: string;

  historic: string[]
  redoHistoric: string[]

  constructor() {
    this.historic = [];
    this.redoHistoric = []
    this.selectedColor = this.colors[0];
    this.tools = [
      new SquareLine(this.selectedColor, 3),
      new SquareSolid(this.selectedColor, 3),
      new FreeHand(this.selectedColor, 10),
      new Eraser(this.selectedColor, 100),
    ]
    this.currentTool = this.tools[0];
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
        this.currentTool.startDrawing(this.ctx, getRelativeCoordinate(ev, this.canvas), this.canvas);
      }

      this.canvas.onmousemove = (ev: MouseEvent) => {
        this.coordinate = getRelativeCoordinate(ev, this.canvas);
        this.currentTool.preview(this.ctx, this.coordinate, this.canvas);
        if(drawing){
          this.currentTool.onDrawing(this.ctx, this.coordinate, this.canvas);
        }
      }

      this.canvas.onmouseup = (ev: MouseEvent) => {
        drawing = false;
        this.currentTool.onEndDrawing(this.ctx, this.coordinate, this.canvas)
      }
    }
  }

  setSize(size: number){
    this.selectedSize = size;
    this.currentTool.setSize(size)
  }

  public setColor(color: string){
    this.selectedColor = color;
    this.currentTool.setColor(color);
  }

  setTool(tool: Tool){
    this.currentTool = tool;
    this.setColor(this.selectedColor);
    this.setSize(this.selectedSize);
  }

  undo(){
    console.log("Undo");
    const img = new Image;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);    
    const source = this.historic.pop();
    img.src = source;
    this.redoHistoric.push(source);
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0);
    };
    console.log(this.historic);
    console.log(this.redoHistoric);
    this.ngOnInit();
  }

  // redo(){
  //   console.log("Redo");
  //   const img = new Image;
  //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  //   const source = this.redoHistoric.pop();
  //   img.src = source;
  //   this.historic.push(source);
  //   img.onload = () => {
  //     this.ctx.drawImage(img, 0, 0);
  //   };
  //   console.log(this.historic);
  //   console.log(this.redoHistoric);
  //   this.ngOnInit();
  // }

  clear(){
    this.historic = []
    this.redoHistoric = []
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ngOnInit();
  }

  isSelectedTool(tool: Tool): boolean {
    return this.currentTool === tool;
  }
}
