import { Player } from './player'

export class GameContext {
    name: string;
    host: Player;
    players: Player[]
    drawer: Player;
    board: string;
}