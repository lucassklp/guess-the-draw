import { Injectable } from '@angular/core';
import { Player } from '../models/player';
import Peer, { DataConnection } from 'peerjs';
import { Message, MessageType } from '../models/message';
import { ConnectablePlayer } from '../models/connectable.player';
import { GameContext } from '../models/game.context';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

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
  host: ConnectablePlayer; //The player who have created the room
  player: ConnectablePlayer; //The owner of this current session
  players: Map<String, Player> //List of all players
  
  peer: Peer;

  resolvers = new Map<MessageType, (message: any) => void>()

  constructor() {
    this.initialize();
    this.peer = new Peer();
    this.players = new Map();
    this.peer.on('open', id => {
      console.log(`My peer ID is: ${id}`);
      this.peer.on('connection', conn => {
        console.log('Connected!', conn);
        this.setConnection(conn.peer, conn);
        conn.on('data', data => this.onReceive(data));
        conn.on('error', err => console.error(err))
      });

      this.peer.on('error', err => console.error('An error occured on peerjs', err))
    });
  }

  initialize(){
    this.resolvers.set(MessageType.Context, this.onReceiveGameContext);
    this.resolvers.set(MessageType.RequestContext, this.onReceiveGameContextRequest);
    this.resolvers.set(MessageType.Draw, this.onReceiveDraw);
  }

  create(roomName: string, playerName: string){
    this.name = roomName;
    const player = new Player();
    player.id = this.peer.id;
    player.name = playerName;
    player.score = 0;
    
    this.host = new ConnectablePlayer(player);
    this.player = this.host;

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
    const message = new Message<Player>();
    message.sender = this.player.id
    message.type = MessageType.RequestContext;
    message.content = player;

    this.connect(hostId)
      .on('open', () => this.send(message, hostId));

    this.players.set(this.player.id, player);
    this.players.set(this.host.id, this.host.asPlayer());
  }

  getConnectionId(...ids: string[]){
    return ids.sort().join('_');
  }

  broadcast(message: Message<any>) {
    this.player.connections.forEach(connection => {
      console.log(connection)
      connection.send(message);
    })
  }

  connect(playerId: string): DataConnection {
    const connectionId = this.getConnectionId(this.player.id, playerId);
    const connection = this.peer.connect(playerId);
    this.player.connections.set(connectionId, connection);
    connection.on('data', data => this.onReceive(data));
    connection.on('error', err => console.error(err))
    return connection;
  }

  setConnection(playerId: string, connection: DataConnection){
    const connectionId = this.getConnectionId(this.player.id, playerId);
    this.player.connections.set(connectionId, connection)
  }

  send(message: Message<any>, playerId: string){
    console.log('Enviou', message);
    const connectionId = this.getConnectionId(playerId, this.player.id);
    const connection = this.player.connections.get(connectionId);
    connection.send(message);
  }

  onReceive(message: Message<any>) {
    console.log('Recebeu', message);
    this.resolvers.get(message.type)(message);
  }

  onReceiveGameContext = (message: Message<GameContext>) => {
    const context = message.content;
    this.host.name = context.host.name;
    this.host.score = context.host.score;

    this.onUpdateDraw(context.board);

    this.players = new Map();
    context.players.forEach(player => {
      this.players.set(player.id, player);
      this.connect(player.id)
    });
  }

  onReceiveGameContextRequest = (message: Message<Player>) => {
    this.players.set(message.sender, message.content)

    const context = new GameContext();
    context.name = this.name;

    context.host = new Player();
    context.host.id = this.host.id
    context.host.name = this.host.name
    context.host.score = this.host.score

    context.players = [];
    this.players.forEach(player => {
      context.players.push(player);
    });

    context.board = this.getContent();

    const reply = new Message<GameContext>();
    reply.content = context;
    reply.sender = this.player.id;
    reply.type = MessageType.Context;

    this.broadcast(reply);
  }

  onReceiveDraw = (message: Message<string>) => {
    this.onUpdateDraw(message.content);
  }

  onUpdateDraw: (content: string) => void;
  getContent: () => string;

  draw(content: string){
    const message = new Message<string>();
    message.sender = this.player.id;
    message.type = MessageType.Draw;
    message.content = content;

    this.broadcast(message);
  }
}
