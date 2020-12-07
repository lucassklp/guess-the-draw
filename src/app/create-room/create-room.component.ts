import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  create(){
    this.route.navigate(["game"]);
  }

}
