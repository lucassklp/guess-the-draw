import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FreeHand } from 'src/app/tools/free-hand';
import { Tool } from 'src/app/tools/tool';
import { Coordinate, getRelativeCoordinate } from 'src/app/models/coordinate';
import { Eraser } from 'src/app/tools/eraser';
import { SquareLine } from 'src/app/tools/square-line';
import { SquareSolid } from 'src/app/tools/square-solid';
import { faRedo, faUndo, faTrash, faShare, faUpload } from '@fortawesome/free-solid-svg-icons';
import { CircleLine } from 'src/app/tools/circle-line';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { PaintBucket } from 'src/app/tools/paint-bucket';
import { Color } from 'src/app/models/color';
import { CircleSolid } from 'src/app/tools/circle-solid';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GameComponent implements OnInit {
  faUndo = faUndo;
  faRedo = faRedo;
  faTrash = faTrash;
  faShare = faShare;
  faUpload = faUpload;

  coordinate: Coordinate = {x: 0, y: 0}
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  svg: HTMLDivElement;

  tools: Tool[];
  selectedTool: Tool;
  selectedSize = 10;

  colors: Color[] = [
    {
      code: '#333',
      hex: 0xFF333333
    },
    {
      code: '#fff',
      hex: 0xFFFFFFFF
    },
    {
      code: '#2ecc71',
      hex: 0xFF71cc2e
    },
    {
      code: '#3498db',
      hex: 0xFFdb9834
    },
    {
      code: '#e74c3c',
      hex: 0xFF3c4ce7
    },
    {
      code: '#8e44ad',
      hex: 0xFFad448e
    },
    {
      code: '#ecf0f1',
      hex: 0xFFf1f0ec
    },
    {
      code: '#f39c12',
      hex: 0xFF129cf3
    },
    {
      code: '#bdc3c7',
      hex: 0xFFc7c3bd
    },    {
      code: '#f1c40f',
      hex: 0xFF0fc4f1
    }
  ];

  selectedColor: Color;

  historic: string[]

  shareUrl: string;
  drawing = false;
  id: string;
  constructor(private route: ActivatedRoute, private roomService: RoomService) {
    this.historic = [];
    this.selectedColor = this.colors[0];
    this.tools = [
      new CircleSolid(this.selectedColor),
      new CircleLine(this.selectedColor, { min: 1, max: 30, current: 5 }),
      new SquareLine(this.selectedColor, { min: 1, max: 30, current: 3 }),
      new SquareSolid(this.selectedColor),
      new FreeHand(this.selectedColor, { min: 1, max: 30, current: 10 }),
      new Eraser(this.selectedColor, { min: 1, max: 500, current: 200 }),
      new PaintBucket(this.selectedColor),
    ]
    this.selectedTool = this.tools[0];

    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });

    roomService.onUpdateDraw = (content : string) => this.setCanvasContent(content);
    roomService.getContent = () => this.canvas.toDataURL();
  }

  ngOnInit(): void {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.svg = document.getElementById('svg') as HTMLDivElement;
    
    if (this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d');
      const rect = this.canvas.getBoundingClientRect();

      this.canvas.width = rect.right - rect.left;
      this.canvas.height = rect.bottom - rect.top;

      this.svg.setAttribute("width", `${rect.right - rect.left}px`);
      this.svg.setAttribute("height", `${rect.bottom - rect.top}px`);

      this.canvas.onmousedown = (ev: MouseEvent) => {
        this.drawing = true;
        this.historic.push(this.canvas.toDataURL());
        this.selectedTool.startDrawing(this.ctx, getRelativeCoordinate(ev, this.canvas), this.canvas);
      }

      this.canvas.onmousemove = (ev: MouseEvent) => {
        this.coordinate = getRelativeCoordinate(ev, this.canvas);
        this.selectedTool.preview(this.ctx, this.coordinate, this.canvas);
        if(this.drawing){
          this.selectedTool.onDrawing(this.ctx, this.coordinate, this.canvas);
        }
      }

      this.canvas.onmouseup = (ev: MouseEvent) => {
        this.drawing = false;
        this.selectedTool.onEndDrawing(this.ctx, this.coordinate, this.canvas);
        this.roomService.draw(this.canvas.toDataURL())
      }
    }
  }

  public setColor(color: Color){
    this.selectedColor = color;
    this.selectedTool.setColor(color);
  }

  public setTool(tool: Tool){
    this.drawing = false;
    this.selectedTool = tool;
    this.setColor(this.selectedColor);
  }

  public undo(){
    const source = this.historic.pop();
    this.setCanvasContent(source);
    this.ngOnInit();
  }

  private setCanvasContent(source: string){
    const img = new Image;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);    
    img.src = source;
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0);
    };
  }

  clear(){
    console.log(this.historic);
    this.historic = []
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ngOnInit();
  }

  share(){
    this.shareUrl = `${environment.baseUrl}/join?id=${this.id}`;
    const input = document.createElement('input');
    input.setAttribute('value', this.shareUrl);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }

  isSelectedTool(tool: Tool): boolean {
    return this.selectedTool === tool;
  }

  get players(){
    return Array.from(this.roomService.players.values())
  }
}
