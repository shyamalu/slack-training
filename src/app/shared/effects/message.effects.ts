import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import {
    ChannelMessageAdded,
    ChannelMessagesLoaded,
    ChannelMessagesRequested,
    MessageActionsTypes,
    PostMessageToChannel
} from '../actions/message.actions';
import { MessageService } from '../services/message.service';
import { ChannelMessage } from '../../model/channel-message';

@Injectable()
export class MessageEffects {

    @Effect({dispatch: true})
    addMessageToChannel$ = this.actions$
        .pipe(
            ofType<PostMessageToChannel>(MessageActionsTypes.PostMessageToChannel),
            mergeMap((action) => this.messageService.addMessageToChannel(action.payload.channelId, action.payload.message)),
            map((result) => new ChannelMessageAdded({channelMessage: result}))
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
}









