import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { ChannelService } from '../services/channel.service';
import {
    AllUserChannelsLoaded,
    AllUserChannelsRequested,
    UserChannelActionTypes,
    UserChannelSaved,
    UserChannelSelected,
    UserChannelStarred,
    UserChannelUnStarred
} from '../actions/user-channel.actions';
import { UserChannel } from '../../model/user-channel';
import { Update } from '@ngrx/entity';

@Injectable()
export class UserChannelsEffects {

    @Effect()
    loadAllUserChannels$ = this.actions$
        .pipe(
            ofType<AllUserChannelsRequested>(UserChannelActionTypes.AllUserChannelsRequested),
            filter((action) => !!action.payload),
            mergeMap((action) => this.ChannelsService.findAllUserChannels(action.payload.userId)),
            filter((userChannels: UserChannel[]) => !!userChannels && userChannels.length > 0),
            map((userChannels: UserChannel[]) => new AllUserChannelsLoaded({userChannels: userChannels}))
        );

    @Effect()
    loadTotalUsersAndStarredInfo$ = this.actions$
        .pipe(
            ofType<UserChannelSelected>(UserChannelActionTypes.UserChannelSelected),
            mergeMap((action) => this.ChannelsService.fetchStarredInfo(action.payload.userId, action.payload.channelId)),
            map((userChannel: UserChannel) => {
                if (!!userChannel) {
                    const userChannelUpdate: Update<UserChannel> = {
                        id     : userChannel.channelId,
                        changes: userChannel
                    };
                    return new UserChannelSaved({userChannel: userChannelUpdate});
                }
            })
        );

    @Effect()
    starred$ = this.actions$
        .pipe(
            ofType<UserChannelStarred>(UserChannelActionTypes.UserChannelStarred),
            mergeMap((action) => this.ChannelsService.markAsStarredChannel(action.payload.userId, action.payload.channelId)),
            map((userChannel: UserChannel) => {
                if (!!userChannel) {
                    const userChannelUpdate: Update<UserChannel> = {
                        id     : userChannel.channelId,
                        changes: userChannel
                    };
                    return new UserChannelSaved({userChannel: userChannelUpdate});
                }
            })
        );

    @Effect()
    unStarred$ = this.actions$
        .pipe(
            ofType<UserChannelUnStarred>(UserChannelActionTypes.UserChannelUnStarred),
            mergeMap((action) => this.ChannelsService.markAsUnStarredChannel(action.payload.userId, action.payload.channelId)),
            map((userChannel: UserChannel) => {
                if (!!userChannel) {
                    const userChannelUpdate: Update<UserChannel> = {
                        id     : userChannel.channelId,
                        changes: userChannel
                    };
                    return new UserChannelSaved({userChannel: userChannelUpdate});
                }
            })
        );

    constructor(private actions$: Actions, private ChannelsService: ChannelService,
                private store: Store<AppState>) {
    }
}









