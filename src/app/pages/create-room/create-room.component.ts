import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
})
export class CreateRoomComponent {
  faCogs = faCogs;

  dictionary = [
    'Carro',
    'Televisão',
    'Porta',
    'Planta',
    'Cadeira',
    'Peixe',
    'Gato',
    'Brasil',
    'Chapéu',
  ].join(';');
  form: FormGroup;

  configActive = false;

  constructor(private route: Router, private room: GameService, private fb: FormBuilder) {
    this.form = fb.group({
      'nickname': ['', Validators.required],
      'duration': [60, [Validators.min(0)]],
      'dictionary': [this.dictionary]
    });
  }

  create() {
    const nickname = this.form.get('nickname').value as string;
    const duration = this.form.get('duration').value as number;
    const dictionary = this.form.get('dictionary').value.split(';').map(word => word.trim());
    this.room.create(nickname, duration, dictionary);
    this.route.navigate(['game'], { queryParams: { id: this.room.peer.id } });
  }
}
