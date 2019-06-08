import { Action } from '@ngrx/store';
import { User } from '../../model/user';
import { Update } from '@ngrx/entity';

export enum UserActionsTypes {
    AllUsersRequested = '[Users Home Page] All User Requested',
    AllUsersLoaded = '[Users API] All User Loaded',
    UserPresenceUpdate = '[Users API] User presence Update',
}

export class AllUsersRequested implements Action {

    readonly type = UserActionsTypes.AllUsersRequested;

    constructor() {

    }
}

export class AllUsersLoaded implements Action {

    readonly type = UserActionsTypes.AllUsersLoaded;

    constructor(public payload: { users: User[] }) {

    }
}

export class UserPresenceUpdate implements Action {

    readonly type = UserActionsTypes.UserPresenceUpdate;

    constructor(public payload: { user: Update<User> }) {

    }
}

export type UserActions =
    | AllUsersRequested
    | AllUsersLoaded
    | UserPresenceUpdate;




