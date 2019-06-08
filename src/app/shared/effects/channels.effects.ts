import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { ChannelService } from '../services/channel.service';
import { AllChannelsLoaded, AllChannelsRequested, ChannelActionTypes, ChannelLoaded, ChannelRequested } from '../actions/channel.actions';
import { Channel } from '../../model/channel';
import { Update } from '@ngrx/entity';

@Injectable()
export class ChannelsEffects {

  @Effect()
  loadAllChannels$ = this.actions$
    .pipe(
      ofType<AllChannelsRequested>(ChannelActionTypes.AllChannelsRequested),
      mergeMap(() => this.ChannelsService.findAllChannels()),
      map((channels: Channel[]) => new AllChannelsLoaded({channels}))
    );

  @Effect()
  loadChannel$ = this.actions$
    .pipe(
      ofType<ChannelRequested>(ChannelActionTypes.ChannelRequested),
      mergeMap((action) => this.ChannelsService.findChannelById(action.payload.channelId)),
      map((channel: Channel) => {
        const channelUpdate: Update<Channel> = {
          id     : channel.id,
          changes: channel
        };

        return new ChannelLoaded({channel: channelUpdate});
      })
    );

  constructor(private actions$: Actions, private ChannelsService: ChannelService,
              private store: Store<AppState>) {

  }

}









