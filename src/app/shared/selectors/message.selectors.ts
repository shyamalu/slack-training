import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChannelMessagesState, selectEntities } from '../reducers/channel-message.reducers';
import * as _ from 'lodash';

export const selectChannelMessagesState = createFeatureSelector<ChannelMessagesState>('channelMessages');
export const selectDirectMessagesState = createFeatureSelector<ChannelMessagesState>('directMessages');

export const selectAllMessagesForChannel = (channelId: string) => createSelector(
    selectChannelMessagesState,
    selectEntities,
    (x) => !!x.entities && !!x.entities[channelId] ? x.entities[channelId][channelId] : []
);

export const selectAllMessagesBetweenUsers = (fromUserId: string, toUserId: string) => createSelector(
    selectDirectMessagesState,
    selectEntities,
    // tslint:disable-next-line:max-line-length
    (x) => {
        const key1 = `${fromUserId}-${toUserId}`;
        const key2 = `${toUserId}-${fromUserId}`;
        // tslint:disable-next-line:max-line-length
        const messages1 = !!x.entities && !!x.entities[`${key1}`] ? x.entities[`${key1}`][`${key1}`] : [];
        const messages2 = !!x.entities && !!x.entities[`${key2}`] ? x.entities[`${key2}`][`${key2}`] : [];
        return _.orderBy([...messages1, ...messages2], ['timestamp'], ['desc']);
    }
);




