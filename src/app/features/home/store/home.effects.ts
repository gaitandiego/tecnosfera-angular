import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { HomeService } from '../services/home.service';
import { HomeActions } from './home.actions';

@Injectable()
export class HomeEffects {
  private readonly actions$ = inject(Actions);
  private readonly homeService = inject(HomeService);

  readonly loadContent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HomeActions.loadContent),
      switchMap(() =>
        this.homeService.getContent().pipe(
          map((content) => HomeActions.loadContentSuccess({ content })),
          catchError(() =>
            of(
              HomeActions.loadContentFailure({
                error: 'No pudimos cargar la portada. Intenta de nuevo.',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
