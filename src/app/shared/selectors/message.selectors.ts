import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChannelMessagesState, selectEntities } from '../reducers/channel-message.reducers';

export const selectChannelMessagesState = createFeatureSelector<ChannelMessagesState>('channelMessages');

export const selectAllMessagesForChannel = (channelId: string) => createSelector(
    selectChannelMessagesState,
    selectEntities,
    (x) => !!x.entities && !!x.entities[channelId] ? x.entities[channelId][channelId] : []
);





