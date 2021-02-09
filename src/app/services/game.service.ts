import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Player } from '../models/player';
import { Envelope, EnvelopeType } from '../models/envelope';
import { Message } from '../models/message';
import { ConnectablePlayer } from '../models/connectable.player';
import { GameContext } from '../models/game.context';
import { RoundContext } from '../models/round.context';
import { PeerService } from './peer.service';
import { HintContext } from '../models/hint.context';

@Injectable({
  providedIn: 'root',
})
export class GameService extends PeerService {
  //Game settings
  dictionary: string[];
  duration: number;

  drawer: Player;
  word: string;
  hits = 10;
  round = 0;
  hints: number[] = [];
  hint: string;
  hintsLeft = 3;
  interval;
  isInterval: boolean = false;
  isRoundRoutinesStarted = false;
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
    resolvers.set(
      EnvelopeType.RequestContext,
      this.onReceiveGameContextRequest
    );
    resolvers.set(EnvelopeType.Draw, this.onReceiveDraw);
    resolvers.set(EnvelopeType.ChatMessage, this.onReceiveChatMessage);
    resolvers.set(EnvelopeType.BeginRound, this.onReceiveBeginRound);
    resolvers.set(EnvelopeType.Hit, this.onReceiveHit);
    resolvers.set(EnvelopeType.Hint, this.onReceiveHint);
  }

  create(
    playerName: string,
    duration: number,
    dictionary: string[]
  ) {
    this.duration = duration;
    this.dictionary = dictionary;

    const player = new Player();
    player.id = this.peer.id;
    player.name = playerName;
    player.score = 0;
    player.draws = 0;

    this.host = new ConnectablePlayer(player);
    this.player = this.host;
    this.drawer = this.player.asPlayer();

    this.players.set(this.host.id, this.host.asPlayer());
  }

  join(playerName: string, hostId: string) {
    const player = new Player();
    player.id = this.peer.id;
    player.name = playerName;
    player.score = 0;
    player.draws = 0;

    this.player = new ConnectablePlayer(player);

    this.host = new ConnectablePlayer();
    this.host.id = hostId;

    //Request game context to host
    const message = new Envelope(
      this.player.id,
      EnvelopeType.RequestContext,
      player
    );

    this.connect(hostId).on('open', () => this.send(message, hostId));

    this.players.set(this.player.id, player);
    this.players.set(this.host.id, this.host.asPlayer());
  }

  start() {
    this.players.forEach((player) => {
      player.draws = 0;
      player.score = 0;
    });
    this.round = 0;
    this.setupNextRound(this.player.id);
    this.startRoundRoutines();
  }

  private pickNextDrawer(): Player {
    const players = Array.from(this.players.values());
    return players.sort((a, b) => a.draws - b.draws)[0];
  }

  private nextRound() {
    const nextDrawer = this.pickNextDrawer();
    this.setupNextRound(nextDrawer.id);
  }

  private setupNextRound(drawerId: string) {
    const word = this.dictionary[
      Math.floor(Math.random() * this.dictionary.length)
    ];
    this.word = word;
    this.drawer = this.players.get(drawerId);
    this.round++;
    this.hintsLeft = 3;
    this.drawer.draws++;

    const context = new RoundContext();
    context.drawer = drawerId;
    context.round = this.round;
    context.word = this.word;
    this.broadcast(
      new Envelope(this.player.id, EnvelopeType.BeginRound, context)
    );
  }

  setTimer(duration: number, onEnd?: () => void) {
    this.time = 0;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      const progress = Math.ceil((this.time * 100) / duration);
      if (this.onTick) {
        this.onTick(this.time, progress);
      }
      this.time++;
      if (this.time > duration) {
        this.time = 0;
        clearInterval(this.interval);
        if (onEnd) {
          onEnd();
        }
      }
    }, 1000);
  }

  startRoundRoutines() {
    this.isRoundRoutinesStarted = true;
    this.onRoundBegin();
    this.isInterval = false;
    this.setTimer(this.duration, () => {
      this.onRoundEnd();
      if (this.round <= 10) {
        if (this.drawer.id === this.player.id) {
          this.nextRound();
        }
        this.setTimer(5, () => {
          this.startRoundRoutines();
        });
        this.isInterval = true;
      } else {
        const players = Array.from(this.players.values());
        const winner = players.sort((a, b) => b.score - a.score)[0];
        alert(`Acabou essa porcaria. O ganhador foi ${winner.name}`);
      }
    });
  }

  hit(playerId: string) {
    this.players.get(this.drawer.id).score += this.hits;
    this.players.get(playerId).score += this.hits;
    this.hits--;
  }

  draw(content: string) {
    const message = new Envelope(this.player.id, EnvelopeType.Draw, content);
    this.broadcast(message);
  }

  sendMessage(content: string) {
    if (this.word.toUpperCase() === content.toUpperCase()) {
      const message = new Envelope(this.player.id, EnvelopeType.Hit, null);
      this.hit(this.player.id);
      this.broadcast(message);
    } else {
      const message = new Envelope(
        this.player.id,
        EnvelopeType.ChatMessage,
        content
      );
      this.broadcast(message);
    }
  }

  isDrawer(): boolean {
    if (this.player && this.drawer) {
      return this.player.id == this.drawer.id;
    }
    return false;
  }

  isHost(): boolean {
    if (this.player && this.host) {
      return this.player.id == this.host.id;
    }
    return false;
  }

  onReceiveGameContext = (message: Envelope<GameContext>) => {
    const context = message.content;
    this.host.name = context.host.name;
    this.host.score = context.host.score;
    this.drawer = context.drawer;
    this.duration = context.duration;
    this.dictionary = context.dictionary;
    this.onUpdateDraw(context.board);

    this.players = new Map();
    context.players.forEach((player) => {
      this.players.set(player.id, player);
      if (this.player.id !== player.id) {
        this.connect(player.id);
      }
    });
  };

  onReceiveGameContextRequest = (message: Envelope<Player>) => {
    this.players.set(message.sender, message.content);
    const context = new GameContext();
    context.host = this.host.asPlayer();
    context.drawer = this.drawer;

    context.players = [];
    this.players.forEach((player) => {
      context.players.push(player);
    });

    context.board = this.getContent();
    context.dictionary = this.dictionary;
    context.duration = this.duration;
    const reply = new Envelope(this.player.id, EnvelopeType.Context, context);
    this.broadcast(reply);
  };

  onReceiveDraw = (message: Envelope<string>) => {
    this.onUpdateDraw(message.content);
  };

  onReceiveChatMessage = (message: Envelope<string>) => {
    const chatMessage = new Message();
    chatMessage.content = message.content;
    chatMessage.sender = this.players.get(message.sender).name;
    this.onReceiveMessage(chatMessage);
  };

  onReceiveBeginRound = (message: Envelope<RoundContext>) => {
    this.drawer = this.players.get(message.content.drawer);
    this.round = message.content.round;
    this.word = message.content.word;
    this.drawer.draws++;
    this.hintsLeft = 3;

    if (!this.isRoundRoutinesStarted) {
      this.startRoundRoutines();
    }
  };

  onReceiveHit = (message: Envelope<string>) => {
    this.hit(message.sender);
  };

  generateHint() {
    this.hits--;
    this.hintsLeft--;
    let hint: string[] = [];
    const leftIndexes = [];

    for (let index = 0; index < this.word.length; index++) {
      hint.push('_');
      if (!this.hints.some((x) => x === index)) {
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
    const message = new Envelope(
      this.player.id,
      EnvelopeType.Hint,
      hintContext
    );

    this.broadcast(message);
  }

  onReceiveHint = (message: Envelope<HintContext>) => {
    this.hint = message.content.hint;
  };
}
