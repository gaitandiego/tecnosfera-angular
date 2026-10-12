import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AUTH_FEATURE_KEY, AuthState } from './auth.state';

const selectAuthState = createFeatureSelector<AuthState>(AUTH_FEATURE_KEY);

export const selectCurrentUser = createSelector(selectAuthState, (state) => state.user);

export const selectIsAuthenticated = createSelector(
  selectCurrentUser,
  (user) => user !== null,
);

export const selectAuthStatus = createSelector(selectAuthState, (state) => state.status);

export const selectAuthError = createSelector(selectAuthState, (state) => state.error);

export const selectIsAuthenticating = createSelector(
  selectAuthStatus,
  (status) => status === 'authenticating',
);
