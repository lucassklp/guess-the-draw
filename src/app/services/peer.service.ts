import { Injectable } from '@angular/core';
import Peer, { DataConnection } from 'peerjs';
import { ConnectablePlayer } from '../models/connectable.player';
import { Envelope, EnvelopeType } from '../models/envelope';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export abstract class PeerService {

  host: ConnectablePlayer; //The player who have created the room
  player: ConnectablePlayer; //The owner of this current session
  players: Map<String, Player> //List of all players

  peer: Peer;

  private resolvers = new Map<EnvelopeType, (message: any) => void>();

  constructor() {
    this.players = new Map();
    this.peer = new Peer();
    this.peer.on('open', id => {
      this.setup(this.resolvers);
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

  abstract setup(resolvers: Map<EnvelopeType, (message: any) => void>);

  getConnectionId(...ids: string[]){
    return ids.sort().join('_');
  }

  broadcast(message: Envelope<any>) {
    const ids = Array.from(this.players.values()).map(p => p.id).join(', ');
    console.log(`Broadcast to [${ids}]`, message);
    this.player.connections.forEach(connection => {
      connection.send(message);
    });
  }

  connect(playerId: string): DataConnection {
    const connectionId = this.getConnectionId(this.player.id, playerId);
    const connection = this.peer.connect(playerId);
    this.player.connections.set(connectionId, connection);
    connection.on('open', () => {
      connection.on('data', data => this.onReceive(data));
      connection.on('error', err => console.error(err))
    })
    return connection;
  }

  send(message: Envelope<any>, playerId: string){
    console.log('Enviou', message);
    const connectionId = this.getConnectionId(playerId, this.player.id);
    const connection = this.player.connections.get(connectionId);
    connection.send(message);
  }

  setConnection(playerId: string, connection: DataConnection){
    const connectionId = this.getConnectionId(this.player.id, playerId);
    this.player.connections.set(connectionId, connection)
  }

  onReceive(message: Envelope<any>) {
    console.log('Recebeu', message);
    this.resolvers.get(message.type)(message);
  }
}
