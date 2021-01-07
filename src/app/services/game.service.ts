import { Injectable } from '@angular/core';
import { Player } from '../models/player';
import { createEnvelope, Envelope, EnvelopeType } from '../models/envelope';
import { Message } from '../models/message';
import { ConnectablePlayer } from '../models/connectable.player';
import { GameContext } from '../models/game.context';
import { RoundContext } from '../models/round.context';
import { PeerService } from './peer.service';
import { HintContext } from '../models/hint.context';

@Injectable({
  providedIn: 'root'
})
export class GameService extends PeerService {

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
  ];

  name: string;
  drawer: Player;
    
  word: string;
  hits = 10;
  round = 0;
  hints: number[] = [];
  hint: string;
  hintsLeft = 3;
  interval;
  private time = 0;

  onUpdateDraw: (content: string) => void;
  onReceiveMessage: (content: Message) => void;
  getContent: () => string;
  onRoundBegin: () => void;
  onRoundEnd: () => void;
  onTick: (time: number, progress: number) => void;

  constructor() {
    super();
  }

  setup(resolvers: Map<EnvelopeType, (message: any) => void>) {
    resolvers.set(EnvelopeType.Context, this.onReceiveGameContext);
    resolvers.set(EnvelopeType.RequestContext, this.onReceiveGameContextRequest);
    resolvers.set(EnvelopeType.Draw, this.onReceiveDraw);
    resolvers.set(EnvelopeType.ChatMessage, this.onReceiveChatMessage);
    resolvers.set(EnvelopeType.BeginRound, this.onReceiveBeginRound);
    resolvers.set(EnvelopeType.Hit, this.onReceiveHit);
    resolvers.set(EnvelopeType.Hint, this.onReceiveHint);
  }

  create(roomName: string, playerName: string){
    this.name = roomName;
    const player = new Player();
    player.id = this.peer.id;
    player.name = playerName;
    player.score = 0;
    
    this.host = new ConnectablePlayer(player);
    this.player = this.host;
    this.drawer = this.player.asPlayer();

    this.players.set(this.host.id, this.host.asPlayer());
  }

  join(playerName: string, hostId: string){
    const player = new Player();
    player.id = this.peer.id;
    player.name = playerName;
    player.score = 0;
    
    this.player = new ConnectablePlayer(player);

    this.host = new ConnectablePlayer();
    this.host.id = hostId;

    //Request game context to host
    const message = new Envelope<Player>();
    message.sender = this.player.id
    message.type = EnvelopeType.RequestContext;
    message.content = player;

    this.connect(hostId)
      .on('open', () => this.send(message, hostId));

    this.players.set(this.player.id, player);
    this.players.set(this.host.id, this.host.asPlayer());
  }

  start(){
    const word = this.dictionary[Math.floor(Math.random() * this.dictionary.length)];
    
    this.round++;
    this.word = word;
    
    const message = new Envelope<RoundContext>();
    message.sender = this.player.id;
    message.type = EnvelopeType.BeginRound;
    message.content = new RoundContext();
    message.content.drawer = this.drawer.id;
    message.content.round = this.round;
    message.content.word = this.word;
    this.onRoundBegin();
    this.broadcast(message);
    this.setTimer();
  }

  setTimer(){
    this.interval = setInterval(() => {
      const progress = Math.ceil((this.time * 100) / 60); //60 is the max value (100%). this can be changed to the time limit.
      this.onTick(this.time, progress);
      this.time++;
      if(this.time == 60){
        clearInterval(this.interval);
        this.onRoundEnd();
      }
    }, 1000);
  }

  hit(playerId: string){
    this.players.get(this.drawer.id).score += this.hits;
    this.players.get(playerId).score += this.hits;
    this.hits--;
  }

  draw(content: string){
    const message = new Envelope<string>();
    message.sender = this.player.id;
    message.type = EnvelopeType.Draw;
    message.content = content;

    this.broadcast(message);
  }

  sendMessage(content: string){
    if(this.word === content){
      const message = new Envelope<string>();
      message.sender = this.player.id;
      message.type = EnvelopeType.Hit;

      this.hit(message.sender);

      this.broadcast(message);
    } else {
      const message = new Envelope<string>();
      message.sender = this.player.id;
      message.type = EnvelopeType.ChatMessage;
      message.content = content;
      this.broadcast(message);
    }
  }

  isDrawer(): boolean {
    if(this.player && this.drawer){
      return this.player.id == this.drawer.id;
    }
    return false;
  }

  isHost(): boolean {
    if(this.player && this.host){
      return this.player.id == this.host.id;
    }
    return false;
  }

  onReceiveGameContext = (message: Envelope<GameContext>) => {
    const context = message.content;
    this.host.name = context.host.name;
    this.host.score = context.host.score;
    this.drawer = context.drawer;
    
    this.onUpdateDraw(context.board);

    this.players = new Map();
    context.players.forEach(player => {
      this.players.set(player.id, player);
      if(this.player.id !== player.id){
        this.connect(player.id)
      }
    });
  }

  onReceiveGameContextRequest = (message: Envelope<Player>) => {
    this.players.set(message.sender, message.content)

    const context = new GameContext();
    context.name = this.name;

    context.host = this.host.asPlayer();
    context.drawer = this.drawer;

    context.players = [];
    this.players.forEach(player => {
      context.players.push(player);
    });

    context.board = this.getContent();

    const reply = new Envelope<GameContext>();
    reply.content = context;
    reply.sender = this.player.id;
    reply.type = EnvelopeType.Context;

    this.broadcast(reply);
  }

  onReceiveDraw = (message: Envelope<string>) => {
    this.onUpdateDraw(message.content);
  }

  onReceiveChatMessage = (message: Envelope<string>) => {
    const chatMessage = new Message();
    chatMessage.content = message.content;
    chatMessage.sender = this.players.get(message.sender).name;
    this.onReceiveMessage(chatMessage);
  }

  onReceiveBeginRound =  (message: Envelope<RoundContext>) => {
    this.drawer = this.players.get(message.content.drawer);
    this.round = message.content.round;
    this.word = message.content.word;

    this.setTimer();
  }

  onReceiveHit = (message: Envelope<string>) => {
    this.hit(message.sender);
  }

  generateHint() {
    this.hits--;
    this.hintsLeft--;
    let hint: string[] = [];
    const leftIndexes = [];

    for (let index = 0; index < this.word.length; index++) {
      hint.push('_');
      if(!this.hints.some(x => x === index)){
        leftIndexes.push(index);
      }
    }

    for (let index = 0; index < this.hints.length; index++) {
      const element = this.hints[index];
      hint[element] = this.word[element];
    }

    const index = leftIndexes[Math.floor(Math.random() * leftIndexes.length)];
    this.hints.push(index);

    this.hint = hint.join();

    const hintContext = new HintContext();
    hintContext.hint = this.hint;
    const message = createEnvelope(EnvelopeType.Hint, this.player.id, hintContext)

    this.broadcast(message);
  }

  onReceiveHint = (message: Envelope<HintContext>) => {
    this.hint = message.content.hint;
    console.log(this.hint)
  };
}
