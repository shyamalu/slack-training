import { Message } from './message';

export interface ChannelMessage {
    [channelId: string]: Message[];
}
