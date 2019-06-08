import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { AllUsersLoaded, AllUsersRequested, UserActionsTypes } from '../actions/user.actions';
import { UserService } from '../services/user.service';
import { User } from '../../model/user';

@Injectable()
export class UserEffects {

    @Effect()
    loadAllUsers$ = this.actions$
        .pipe(
            ofType<AllUsersRequested>(UserActionsTypes.AllUsersRequested),
            mergeMap((action) => this.userService.findAllUsers()),
            map((users: User[]) => new AllUsersLoaded({users}))
        );

    constructor(private actions$: Actions, private userService: UserService,
                private store: Store<AppState>) {
    }
}









