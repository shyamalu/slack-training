import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ChannelMessage } from '../../model/channel-message';
import { MessageActions, MessageActionsTypes } from '../actions/message.actions';
import * as _ from 'lodash';

export interface ChannelMessagesState extends EntityState<ChannelMessage> {

}

export const adapter: EntityAdapter<ChannelMessage> = createEntityAdapter<ChannelMessage>(
    {
        selectId: c => Object.keys(c)[0]
    }
);

export const initialChannelMessagesState: ChannelMessagesState = adapter.getInitialState({});

export function channelMessagesReducer(state = initialChannelMessagesState, action: MessageActions): ChannelMessagesState {

    switch (action.type) {

        case MessageActionsTypes.ChannelMessagesLoaded:
            // @ts-ignore
            const changedEntities: ChannelMessage[] = _.map(action.payload, (o: ChannelMessage) => {
                const result = {...o};
                _.keys(o).forEach((k) => {
                    const existingMessages = [].concat(..._.values(_.get(state.entities, k)));
                    result[k] = _.orderBy(_.uniqBy([...existingMessages, ..._.get(o, k)], 'messageId'), ['timestamp'], ['desc']);
                });
                return result;
            });
            return adapter.upsertOne(changedEntities.shift(), {...state});
        case MessageActionsTypes.ChannelMessageAdded:
            // @ts-ignore
            const changedEntities: ChannelMessage[] = _.map(action.payload, (o: ChannelMessage) => {
                const result = {...o};
                _.keys(o).forEach((k) => {
                    const existingMessages = [].concat(..._.values(_.get(state.entities, k)));
                    result[k] = _.orderBy(_.uniqBy([...existingMessages, ..._.get(o, k)], 'messageId'), ['timestamp'], ['desc']);
                });
                return result;
            });
            return adapter.upsertOne(changedEntities.shift(), {...state});
        default: {

            return state;
        }

    }
}

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal

} = adapter.getSelectors();








