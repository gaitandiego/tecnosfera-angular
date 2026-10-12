import { createReducer, on } from '@ngrx/store';

import { User } from '../../../core/models/user.model';
import { AuthStatus } from '../models/auth.model';
import { AuthActions } from './auth.actions';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  readonly user: User | null;
  readonly status: AuthStatus;
  readonly error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.restoreSessionSuccess, (state, { user }): AuthState => ({
    ...state,
    user,
    status: user ? 'authenticated' : 'idle',
  })),
  on(AuthActions.login, (state): AuthState => ({
    ...state,
    status: 'authenticating',
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { user }): AuthState => ({
    ...state,
    user,
    status: 'authenticated',
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }): AuthState => ({
    ...state,
    user: null,
    status: 'error',
    error,
  })),
  on(AuthActions.logout, (): AuthState => initialAuthState),
  on(AuthActions.clearError, (state): AuthState => ({
    ...state,
    error: null,
    status: state.user ? 'authenticated' : 'idle',
  })),
);
