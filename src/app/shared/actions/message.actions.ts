import { Action } from '@ngrx/store';
import { ChannelMessage } from '../../model/channel-message';
import { Message } from '../../model/message';

export enum MessageActionsTypes {
    ChannelMessagesRequested = '[Messages Home Page] Channel Messages Requested',
    ChannelMessageAdded = '[Messages Home Page] Channel Message Added',
    PostMessageToChannel = '[Message Dialog] Send Message to Channel',
    PostMessageToDirectUser = '[Message Dialog] Send Message to Direct User',
    ChannelMessagesLoaded = '[Messages Home Page] Channel Messages Loaded',
}

export class ChannelMessagesRequested implements Action {

    readonly type = MessageActionsTypes.ChannelMessagesRequested;

    constructor(public payload: { channelId: string, criteria: number, pageSize: number }) {

    }
}

export class ChannelMessagesLoaded implements Action {

    readonly type = MessageActionsTypes.ChannelMessagesLoaded;

    constructor(public payload: { channelMessage: ChannelMessage }) {

    }
}

export class ChannelMessageAdded implements Action {

    readonly type = MessageActionsTypes.ChannelMessageAdded;

    constructor(public payload: { channelMessage: ChannelMessage }) {

    }
}

export class PostMessageToChannel implements Action {

    readonly type = MessageActionsTypes.PostMessageToChannel;

    constructor(public payload: { channelId: string, message: Message }) {

    }
}

export class PostMessageToDirectUser implements Action {

    readonly type = MessageActionsTypes.PostMessageToDirectUser;

    constructor(public payload: { fromUserId: string, toUserId: string, message: Message }) {

    }
}

export type MessageActions =
    | ChannelMessagesRequested
    | ChannelMessageAdded
    | PostMessageToChannel
    | PostMessageToDirectUser
    | ChannelMessagesLoaded;




