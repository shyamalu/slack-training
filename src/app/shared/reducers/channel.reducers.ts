import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Channel } from '../../model/channel';
import { ChannelActions, ChannelActionTypes } from '../actions/channel.actions';

export interface ChannelsState extends EntityState<Channel> {

  allChannelsLoaded: boolean;

}

export const adapter: EntityAdapter<Channel> = createEntityAdapter<Channel>();

export const initialChannelsState: ChannelsState = adapter.getInitialState({
  allChannelsLoaded: false
});

export function channelsReducer(state = initialChannelsState, action: ChannelActions): ChannelsState {

  switch (action.type) {

    case ChannelActionTypes.ChannelSaved:
      return adapter.addOne(action.payload.channel, state);
    case ChannelActionTypes.AllChannelsLoaded:
      return adapter.addAll(action.payload.channels, {...state, allChannelsLoaded: true});
    case ChannelActionTypes.ChannelLoaded:
      return adapter.updateOne(action.payload.channel, state);
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








