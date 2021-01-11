import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { faCogs } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {
  faCogs = faCogs
  player: string;
  roomName: string;
  duration = 60;
  dictionary = [
    'Carro',
    'Televisão',
    'Porta',
    'Planta',
    'Cadeira',
    'Peixe',
    'Gato',
    'Brasil',
    'Chapéu'
  ].join(';');

  displaySettings = false;

  constructor(private route: Router, private room: GameService) { }

  ngOnInit(): void {
  }

  create(){
    const dictionary = this.dictionary.split(';')
      .map(word => word.trim());

    this.room.create(this.roomName, this.player, this.duration, dictionary);
    this.route.navigate(['game'], { queryParams: { id: this.room.peer.id }});
  }

}
