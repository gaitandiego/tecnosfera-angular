import { User } from '../../../core/models/user.model';
import {
  selectAuthError,
  selectAuthStatus,
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsAuthenticating,
} from './auth.selectors';
import { AuthState, initialAuthState } from './auth.state';

describe('auth selectors', () => {
  const user: User = { email: 'admin@tecnosfera.co', displayName: 'Administrador', role: 'admin' };

  const stateWith = (auth: AuthState) => ({ auth });

  it('selects the current user', () => {
    expect(selectCurrentUser.projector({ ...initialAuthState, user })).toEqual(user);
  });

  it('reports an authenticated session', () => {
    expect(selectIsAuthenticated(stateWith({ ...initialAuthState, user }))).toBeTrue();
    expect(selectIsAuthenticated(stateWith(initialAuthState))).toBeFalse();
  });

  it('selects the status and the error message', () => {
    const state: AuthState = { user: null, status: 'error', error: 'Credenciales' };

    expect(selectAuthStatus(stateWith(state))).toBe('error');
    expect(selectAuthError(stateWith(state))).toBe('Credenciales');
  });

  it('reports an in-flight request', () => {
    expect(selectIsAuthenticating.projector('authenticating')).toBeTrue();
    expect(selectIsAuthenticating.projector('idle')).toBeFalse();
  });
});
