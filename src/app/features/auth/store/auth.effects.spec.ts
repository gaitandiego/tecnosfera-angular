import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';

import { User } from '../../../core/models/user.model';
import { AuthService } from '../services/auth.service';
import { AuthActions } from './auth.actions';
import { AuthEffects, POST_LOGIN_ROUTE } from './auth.effects';

describe('AuthEffects', () => {
  let actions$: Observable<unknown>;
  let effects: AuthEffects;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const user: User = { email: 'admin@tecnosfera.co', displayName: 'Administrador', role: 'admin' };
  const credentials = { username: 'admin@tecnosfera.co', password: 'tecnosfera', rememberMe: true };

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', [
      'login',
      'logout',
      'restoreSession',
    ]);
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    router.navigateByUrl.and.resolveTo(true);

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });

    effects = TestBed.inject(AuthEffects);
  });

  it('maps a successful login to loginSuccess', (done) => {
    authService.login.and.returnValue(of(user));
    actions$ = of(AuthActions.login({ credentials }));

    effects.login$.subscribe((action) => {
      expect(action).toEqual(AuthActions.loginSuccess({ user }));
      expect(authService.login).toHaveBeenCalledWith(credentials);
      done();
    });
  });

  it('maps a rejected login to loginFailure with the message', (done) => {
    authService.login.and.returnValue(throwError(() => new Error('Usuario o contraseña incorrectos')));
    actions$ = of(AuthActions.login({ credentials }));

    effects.login$.subscribe((action) => {
      expect(action).toEqual(
        AuthActions.loginFailure({ error: 'Usuario o contraseña incorrectos' }),
      );
      done();
    });
  });

  it('navigates to the management screen after a successful login', (done) => {
    actions$ = of(AuthActions.loginSuccess({ user }));

    effects.redirectAfterLogin$.subscribe(() => {
      expect(router.navigateByUrl).toHaveBeenCalledWith(POST_LOGIN_ROUTE);
      done();
    });
  });

  it('clears the session and goes home on logout', (done) => {
    actions$ = of(AuthActions.logout());

    effects.logout$.subscribe(() => {
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/');
      done();
    });
  });

  it('maps a restored session to restoreSessionSuccess', (done) => {
    authService.restoreSession.and.returnValue(of(user));
    actions$ = of(AuthActions.restoreSession());

    effects.restoreSession$.subscribe((action) => {
      expect(action).toEqual(AuthActions.restoreSessionSuccess({ user }));
      done();
    });
  });
});
