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
    sender: string;
    type: EnvelopeType
    content: T;
}

export function createEnvelope<T>(type: EnvelopeType, playerId: string, data: T): Envelope<T>{
    const message = new Envelope<T>();
    message.content = data;
    message.sender = playerId;
    message.type = type;
    return message;
}