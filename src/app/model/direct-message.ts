import { Message } from './message';

export interface DirectMessage {
    [senderUserId: string]: PrivateMessage[];
}

export interface PrivateMessage {
    [receipientId: string]: Message[];
}
