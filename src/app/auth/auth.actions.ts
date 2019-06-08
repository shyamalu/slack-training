import { Action } from '@ngrx/store';
import { User } from '../model/user';

export enum AuthActionTypes {
  LoginAction = '[Auth] Login Action',
  LogoutAction = '[Auth] Logout Action'
}

export class Login implements Action {
  readonly type = AuthActionTypes.LoginAction;

  constructor(public payload: { user: User }) {

  }
}

export class Logout implements Action {
  readonly type = AuthActionTypes.LogoutAction;
}

export type AuthActions = Login | Logout;
