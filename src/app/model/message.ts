import { User } from './user';

export interface Message {
    messageId: string;
    content: string;
    timestamp: number;
    sentBy: User;
}
