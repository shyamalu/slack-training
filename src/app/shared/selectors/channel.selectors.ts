import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromChannel from '../reducers/channel.reducers';
import { ChannelsState } from '../reducers/channel.reducers';

export const selectChannelsState = createFeatureSelector<ChannelsState>('channels');

export const selectAllChannels = createSelector(
  selectChannelsState,
  fromChannel.selectAll
);

export const selectChannelById = (channelId: string) => createSelector(
  selectAllChannels,
  channels => {
    const selected = channels.filter(channel => channel.id === channelId)
      .shift();
    console.log('seelected', JSON.stringify(selected));
    return selected;
  }
);

export const countChannels = createSelector(
  selectChannelsState,
  fromChannel.selectTotal
);

export const allChannelsLoaded = createSelector(
  selectChannelsState,
  channelsState => channelsState.allChannelsLoaded
);







