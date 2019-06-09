import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import {
    ChannelMessageAdded,
    ChannelMessagesLoaded,
    ChannelMessagesRequested,
    DirectMessageAdded,
    DirectMessagesLoaded,
    DirectMessagesLoadedFromOther,
    DirectMessagesRequested,
    DirectMessagesRequestedFromOther,
    MessageActionsTypes,
    PostMessageToChannel,
    PostMessageToDirectUser
} from '../actions/message.actions';
import { MessageService } from '../services/message.service';
import { ChannelMessage } from '../../model/channel-message';
import { DirectMessage } from '../../model/direct-message';

@Injectable()
export class MessageEffects {

    @Effect({dispatch: true})
    addMessageToChannel$ = this.actions$
        .pipe(
            ofType<PostMessageToChannel>(MessageActionsTypes.PostMessageToChannel),
            mergeMap((action) => this.messageService.addMessageToChannel(action.payload.channelId, action.payload.message)),
            map((result) => new ChannelMessageAdded({channelMessage: result}))
        );

    @Effect({dispatch: true})
    addMessageToDirectUser$ = this.actions$
        .pipe(
            ofType<PostMessageToDirectUser>(MessageActionsTypes.PostMessageToDirectUser),
            // tslint:disable-next-line:max-line-length
            mergeMap((action) => this.messageService.addMessageToDirectUser(action.payload.fromUserId, action.payload.toUserId, action.payload.message)),
            map((result) => new DirectMessageAdded({directMessage: result}))
        );

    constructor(private actions$: Actions, private messageService: MessageService,
                private store: Store<AppState>) {
    }

    @Effect({dispatch: true})
    findChannelMessages$ = this.actions$
        .pipe(
            ofType<ChannelMessagesRequested>(MessageActionsTypes.ChannelMessagesRequested),
            switchMap((action) => this.messageService.findMessagesForChannel(
                action.payload.channelId,
                action.payload.criteria,
                action.payload.pageSize)),
            map((channelMessage: ChannelMessage) => new ChannelMessagesLoaded({channelMessage}))
        );

    @Effect({dispatch: true})
    findDirectMessages$ = this.actions$
        .pipe(
            ofType<DirectMessagesRequested>(MessageActionsTypes.DirectMessagesRequested),
            switchMap((action) => this.messageService.findMessagesFromUserToUser(
                action.payload.fromUserId,
                action.payload.toUserId,
                action.payload.criteria,
                action.payload.pageSize)),
            map((directMessage: DirectMessage) => new DirectMessagesLoaded({directMessage}))
        );

    @Effect({dispatch: true})
    findDirectMessagesFromOther$ = this.actions$
        .pipe(
            ofType<DirectMessagesRequestedFromOther>(MessageActionsTypes.DirectMessagesRequestedFromOther),
            switchMap((action) => this.messageService.findMessagesFromUserToUser(
                action.payload.fromUserId,
                action.payload.toUserId,
                action.payload.criteria,
                action.payload.pageSize)),
            map((directMessage: DirectMessage) => new DirectMessagesLoadedFromOther({directMessage}))
        );
}









