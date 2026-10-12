import { User } from '../../../core/models/user.model';
import { AuthActions } from './auth.actions';
import { AuthState, authReducer, initialAuthState } from './auth.state';

describe('authReducer', () => {
  const user: User = { email: 'admin@tecnosfera.co', displayName: 'Administrador', role: 'admin' };
  const credentials = { username: 'admin@tecnosfera.co', password: 'tecnosfera', rememberMe: false };

  it('returns the initial state for an unknown action', () => {
    const state = authReducer(undefined, { type: 'unknown' });

    expect(state).toEqual(initialAuthState);
  });

  it('marks the slice as authenticating on login', () => {
    const state = authReducer(
      { ...initialAuthState, error: 'previo' },
      AuthActions.login({ credentials }),
    );

    expect(state.status).toBe('authenticating');
    expect(state.error).toBeNull();
  });

  it('stores the user on a successful login', () => {
    const state = authReducer(initialAuthState, AuthActions.loginSuccess({ user }));

    expect(state.user).toEqual(user);
    expect(state.status).toBe('authenticated');
    expect(state.error).toBeNull();
  });

  it('stores the message and clears the user on a failed login', () => {
    const previous: AuthState = { ...initialAuthState, user };

    const state = authReducer(previous, AuthActions.loginFailure({ error: 'Credenciales' }));

    expect(state.user).toBeNull();
    expect(state.status).toBe('error');
    expect(state.error).toBe('Credenciales');
  });

  it('restores a remembered session', () => {
    const state = authReducer(initialAuthState, AuthActions.restoreSessionSuccess({ user }));

    expect(state.status).toBe('authenticated');
    expect(state.user).toEqual(user);
  });

  it('stays idle when there is no remembered session', () => {
    const state = authReducer(initialAuthState, AuthActions.restoreSessionSuccess({ user: null }));

    expect(state.status).toBe('idle');
    expect(state.user).toBeNull();
  });

  it('resets the slice on logout', () => {
    const previous: AuthState = { user, status: 'authenticated', error: null };

    expect(authReducer(previous, AuthActions.logout())).toEqual(initialAuthState);
  });

  it('clears the error without dropping the session', () => {
    const previous: AuthState = { user, status: 'error', error: 'Credenciales' };

    const state = authReducer(previous, AuthActions.clearError());

    expect(state.error).toBeNull();
    expect(state.status).toBe('authenticated');
  });
});
