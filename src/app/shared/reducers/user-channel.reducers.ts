import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UserChannel } from '../../model/user-channel';
import { UserChannelActions, UserChannelActionTypes } from '../actions/user-channel.actions';

export interface UserChannelsState extends EntityState<UserChannel> {
  allUserChannelsLoaded: boolean;

}

export const adapter: EntityAdapter<UserChannel> = createEntityAdapter<UserChannel>();

export const initialUserChannelsState: UserChannelsState = adapter.getInitialState({
  allUserChannelsLoaded: false
});

export function userChannelsReducer(state = initialUserChannelsState, action: UserChannelActions): UserChannelsState {

  switch (action.type) {

    case UserChannelActionTypes.UserChannelSaved:
      return adapter.updateOne(action.payload.userChannel, state);

    case UserChannelActionTypes.AllUserChannelsLoaded:
      return adapter.addAll(action.payload.userChannels, {...state, allUserChannelsLoaded: true});
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








