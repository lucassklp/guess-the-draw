import { Player } from './player';

import { DataConnection } from 'peerjs';

export class ConnectablePlayer extends Player {
    connections: Map<string, DataConnection>;
    
    constructor(player?: Player){
        super();
        this.connections = new Map();
        if(player){
            this.id = player.id;
            this.name = player.name;
            this.score = player.score;
            this.draws = player.draws;
        }
    }

    asPlayer(): Player {
        const player = new Player();
        player.name = this.name;
        player.id = this.id;
        player.score = this.score;
        player.draws = this.draws;
        return player;
    }
}
