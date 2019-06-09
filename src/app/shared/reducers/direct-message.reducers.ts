import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { DirectMessage } from '../../model/direct-message';
import { MessageActions, MessageActionsTypes } from '../actions/message.actions';
import * as _ from 'lodash';

export interface DirectMessagesState extends EntityState<DirectMessage> {

}

export const adapter: EntityAdapter<DirectMessage> = createEntityAdapter<DirectMessage>(
    {
        selectId: c => Object.keys(c)[0]
    }
);

export const initialDirectMessagesState: DirectMessagesState = adapter.getInitialState({});

export function directMessagesReducer(state = initialDirectMessagesState, action: MessageActions): DirectMessagesState {

    switch (action.type) {

        case MessageActionsTypes.DirectMessagesLoadedFromOther:
        case MessageActionsTypes.DirectMessagesLoaded:
            // @ts-ignore
            const changedEntities: DirectMessage[] = _.map(action.payload, (o: DirectMessage) => {
                const result = {...o};
                _.keys(o).forEach((k) => {
                    const existingMessages = [].concat(..._.values(_.get(state.entities, k)));
                    result[k] = _.orderBy(_.uniqBy([...existingMessages, ..._.get(o, k)], 'messageId'), ['timestamp'], ['desc']);
                });
                return result;
            });
            return adapter.upsertOne(changedEntities.shift(), {...state});
        case MessageActionsTypes.DirectMessageAdded:
            // @ts-ignore
            const changedEntities: DirectMessage[] = _.map(action.payload, (o: DirectMessage) => {
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








