import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnInit {

  player: string;
  id: string;
  constructor(private route: ActivatedRoute, private room: RoomService, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });
  }

  join(){
    this.room.join(this.player, this.id);
    this.router.navigate(['game'], {queryParams: { id: this.id }});
  }
}
