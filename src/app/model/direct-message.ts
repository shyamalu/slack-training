import { Message } from './message';

// fromUserId-toUserId - key
export interface DirectMessage {
    [keyId: string]: Message[];
}
