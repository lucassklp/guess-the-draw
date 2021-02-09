import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './pages/game/game.component';
import { CreateRoomComponent } from './pages/create-room/create-room.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JoinRoomComponent } from './pages/join-room/join-room.component';
import { APP_BASE_HREF } from '@angular/common';
import { environment } from 'src/environments/environment';
import { NgxErrorsModule } from '@ngspot/ngx-errors';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    CreateRoomComponent,
    JoinRoomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgxErrorsModule
  ],
  providers: [{provide: APP_BASE_HREF, useValue: environment.baseHref}],
  bootstrap: [AppComponent]
})
export class AppModule { }
