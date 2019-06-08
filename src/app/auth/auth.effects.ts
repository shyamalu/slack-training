import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AuthActionTypes, Login, Logout } from './auth.actions';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { defer, of } from 'rxjs';
import { UserService } from '../shared/services/user.service';
import { User } from '../model/user';
import { AppState } from '../reducers';
import { Store } from '@ngrx/store';
import { AllUserChannelsRequested } from '../shared/actions/user-channel.actions';

@Injectable()
export class AuthEffects {

  constructor(private actions$: Actions,
              private router: Router,
              private store: Store<AppState>,
              private userServices: UserService) {

  }

  @Effect({dispatch: false})
  login$ = this.actions$.pipe(
    ofType<Login>(AuthActionTypes.LoginAction),
    tap(
      action => {
        const changes: User = action.payload.user;
        this.userServices.createUser(changes.id, changes)
          .subscribe(
            () => {
              sessionStorage.setItem('user', JSON.stringify(action.payload.user));
              this.store.dispatch(new AllUserChannelsRequested({userId: action.payload.user.id}));
            }
          );
      }
    )
  );

  @Effect({dispatch: false})
  logout$ = this.actions$.pipe(
    ofType<Login>(AuthActionTypes.LogoutAction),
    tap(() => {
      const loggedInUser: User = JSON.parse(sessionStorage.getItem('user'));
      if (!!loggedInUser && !!loggedInUser.id) {
        this.userServices.logoutUser(loggedInUser.id)
          .subscribe(
            () => {
              this.router.navigateByUrl('/login');
              sessionStorage.removeItem('user');
            }
          );
      }
    })
  );

  // init side effect -- read from local storage and send login
  @Effect()
  init$ = defer(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      return of(new Login({user: JSON.parse(userData)}));
    } else {
      return <any>of(new Logout());
    }
  });
}
