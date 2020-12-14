export enum MessageType {
    RequestContext,
    Context,
    Draw
}

export class Message<T> {
    sender: string;
    type: MessageType
    content: T;
}