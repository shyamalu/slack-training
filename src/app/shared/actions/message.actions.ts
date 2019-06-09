import { Action } from '@ngrx/store';
import { ChannelMessage } from '../../model/channel-message';
import { Message } from '../../model/message';
import { DirectMessage } from '../../model/direct-message';

export enum MessageActionsTypes {
    ChannelMessagesRequested = '[Messages Home Page] Channel Messages Requested',
    ChannelMessagesLoaded = '[Messages Home Page] Channel Messages Loaded',
    ChannelMessageAdded = '[Messages Home Page] Channel Message Added',
    DirectMessagesRequested = '[Messages Home Page] Direct Messages Requested',
    DirectMessagesLoaded = '[Messages Home Page] Direct Messages Loaded',
    DirectMessagesRequestedFromOther = '[Messages Home Page] Other User Direct Messages Requested',
    DirectMessagesLoadedFromOther = '[Messages Home Page] Other User Direct Messages Loaded',
    DirectMessageAdded = '[Messages Home Page] Direct Message Added',
    PostMessageToChannel = '[Message Dialog] Send Message to Channel',
    PostMessageToDirectUser = '[Message Dialog] Send Message to Direct User'
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

export class DirectMessagesRequested implements Action {

    readonly type = MessageActionsTypes.DirectMessagesRequested;

    constructor(public payload: { fromUserId: string, toUserId: string, criteria: number, pageSize: number }) {

    }
}

export class DirectMessagesLoaded implements Action {

    readonly type = MessageActionsTypes.DirectMessagesLoaded;

    constructor(public payload: { directMessage: DirectMessage }) {

    }
}

export class DirectMessagesRequestedFromOther implements Action {

    readonly type = MessageActionsTypes.DirectMessagesRequestedFromOther;

    constructor(public payload: { fromUserId: string, toUserId: string, criteria: number, pageSize: number }) {

    }
}

export class DirectMessagesLoadedFromOther implements Action {

    readonly type = MessageActionsTypes.DirectMessagesLoadedFromOther;

    constructor(public payload: { directMessage: DirectMessage }) {

    }
}

export class ChannelMessageAdded implements Action {

    readonly type = MessageActionsTypes.ChannelMessageAdded;

    constructor(public payload: { channelMessage: ChannelMessage }) {

    }
}

export class DirectMessageAdded implements Action {

    readonly type = MessageActionsTypes.DirectMessageAdded;

    constructor(public payload: { directMessage: DirectMessage }) {

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
    | ChannelMessagesLoaded
    | DirectMessageAdded
    | DirectMessagesRequested
    | DirectMessagesLoaded
    | DirectMessagesRequestedFromOther
    | DirectMessagesLoadedFromOther;




