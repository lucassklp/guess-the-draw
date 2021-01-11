export enum EnvelopeType {
    RequestContext,
    Context,
    Draw,
    ChatMessage,
    BeginRound,
    Hit,
    EndRound,
    Hint
}

export class Envelope<T> {
    constructor(public sender: string, public type: EnvelopeType, public content: T){}
}