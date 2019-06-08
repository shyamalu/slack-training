import { createSelector } from '@ngrx/store';

export const selectAuthState = state => state.auth;

export const loggedInUserId = createSelector(
  selectAuthState,
  (auth) => auth.user ? auth.user.id : undefined
);

export const isLoggedIn = createSelector(
  selectAuthState,
  (auth) => auth.loggedIn
);

export const currentUser = createSelector(
    selectAuthState,
    (auth) => auth.user
);


export const isLoggedOut = createSelector(
  isLoggedIn,
  (loggedIn) => !loggedIn
);

export const selectAvatar = createSelector(
  selectAuthState,
  (auth) => auth.user ? auth.user.avatar : null
);

export const selectDisplayName = createSelector(
  selectAuthState,
  (auth) => auth.user ? auth.user.displayName : null
);




