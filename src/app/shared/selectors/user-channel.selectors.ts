import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUserChannel from '../reducers/user-channel.reducers';
import { UserChannelsState } from '../reducers/user-channel.reducers';
import { UserChannel } from '../../model/user-channel';

export const selectUserChannelsState = createFeatureSelector<UserChannelsState>('userChannels');

export const selectAllUserChannels = createSelector(
  selectUserChannelsState,
  fromUserChannel.selectAll
);

export const selectUserChannelById = (userId: string, channelId: string) => createSelector(
  selectAllUserChannels,
  (userChannels: UserChannel[]) => {
    const selected = userChannels.filter(userChannel => userChannel.channelId === channelId
      && userChannel.userId === userId)
      .shift();
    console.log('selected', JSON.stringify(selected));
    return selected;
  }
);

export const selectStarredUserChannelById = (userId: string, channelId: string) => createSelector(
  selectAllUserChannels,
  (userChannels: UserChannel[]) => {
    const selected = userChannels.filter(userChannel => userChannel.channelId === channelId
      && userChannel.userId === userId)
      .shift();
    console.log('selected.isStarred', selected.isStarred);
    return selected.isStarred;
  }
);

export const countUserChannels = createSelector(
  selectUserChannelsState,
  fromUserChannel.selectTotal
);

export const allChannelsLoaded = createSelector(
  selectUserChannelsState,
  state => state.allUserChannelsLoaded
);







