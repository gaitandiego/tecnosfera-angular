import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { AuthActions } from './auth.actions';

export const POST_LOGIN_ROUTE = '/gestion';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly restoreSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.restoreSession),
      exhaustMap(() =>
        this.authService
          .restoreSession()
          .pipe(map((user) => AuthActions.restoreSessionSuccess({ user }))),
      ),
    ),
  );

  readonly login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((user) => AuthActions.loginSuccess({ user })),
          catchError((error: Error) =>
            of(AuthActions.loginFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  readonly redirectAfterLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => void this.router.navigateByUrl(POST_LOGIN_ROUTE)),
      ),
    { dispatch: false },
  );

  readonly logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.logout();
          void this.router.navigateByUrl('/');
        }),
      ),
    { dispatch: false },
  );
}
