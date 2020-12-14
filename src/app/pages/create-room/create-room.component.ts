import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {
  
  player: string;
  roomName: string;
  constructor(private route: Router, private room: RoomService) { }

  ngOnInit(): void {
  }

  create(){
    this.room.create(this.roomName, this.player);
    this.route.navigate(['game'], { queryParams: { id: this.room.peer.id }});
  }

}
