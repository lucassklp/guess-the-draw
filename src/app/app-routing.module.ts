import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './pages/game/game.component';
import { CreateRoomComponent } from './pages/create-room/create-room.component';
import { JoinRoomComponent } from './pages/join-room/join-room.component';


const routes: Routes = [
  {
    path: '',
    component: CreateRoomComponent
  },
  {
    path: 'join',
    component: JoinRoomComponent
  },
  {
    path: 'game',
    component: GameComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
