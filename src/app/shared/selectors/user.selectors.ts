import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUser from '../reducers/user.reducers';
import { UsersState } from '../reducers/user.reducers';
import { User } from '../../model/user';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectAllUsers = createSelector(
    selectUsersState,
    fromUser.selectAll
);

export const selectAllOtherUsers = (userId: string) => createSelector(
    selectAllUsers,
    (users: User[]) => {
        return users.filter((user) => user.id
            && user.id !== userId);

    }
);





