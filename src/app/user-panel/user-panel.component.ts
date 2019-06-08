import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { isLoggedIn, isLoggedOut, selectAvatar, selectDisplayName } from '../auth/auth.selector';
import { Logout } from '../auth/auth.actions';

@Component({
  selector   : 'user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls  : ['./user-panel.component.scss']
})
export class UserPanelComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  pictureUrl$: Observable<string>;
  displayName$: Observable<string>;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {

    this.isLoggedIn$ = this.store
      .pipe(
        select(isLoggedIn)
      );

    this.isLoggedOut$ = this.store
      .pipe(
        select(isLoggedOut)
      );

    this.pictureUrl$ = this.store
      .pipe(
        select(selectAvatar)
      );

    this.displayName$ = this.store
      .pipe(
        select(selectDisplayName)
      );
  }

  logout() {
    this.store.dispatch(new Logout());
  }
}
