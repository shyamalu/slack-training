import { AuthActions, AuthActionTypes } from './auth.actions';
import { User } from '../model/user';
import { createSelector } from '@ngrx/store';
import * as fromChannel from '../shared/reducers/channel.reducers';
import { selectChannelsState } from '../shared/selectors/channel.selectors';

export interface AuthState {
  loggedIn: boolean;
  user: User;
}

export const initialAuthState: AuthState = {
  loggedIn: false,
  user    : undefined
};

export function authReducer(state = initialAuthState, action: AuthActions): AuthState {
  switch (action.type) {
    case AuthActionTypes.LoginAction:
      return {...state, loggedIn: true, user: action.payload.user};
    case AuthActionTypes.LogoutAction:
      return {...state, loggedIn: false, user: undefined};
    default:
      return state;
  }
}
