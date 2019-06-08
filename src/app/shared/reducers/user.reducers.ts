import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { User } from '../../model/user';
import { UserActions, UserActionsTypes } from '../actions/user.actions';

export interface UsersState extends EntityState<User> {
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialUsersState: UsersState = adapter.getInitialState({});

export function usersReducer(state = initialUsersState, action: UserActions): UsersState {

    switch (action.type) {

        case UserActionsTypes.AllUsersLoaded:
            return adapter.addAll(action.payload.users, {...state});
        case UserActionsTypes.UserPresenceUpdate:
            return adapter.updateOne(action.payload.user, {...state});
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








