import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';

import { FavoritesService } from '../services/favorites.service';
import { FavoritesActions } from './favorites.actions';
import { selectFavoriteEntries } from './favorites.selectors';

@Injectable()
export class FavoritesEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly favoritesService = inject(FavoritesService);

  readonly load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.load),
      switchMap(() =>
        this.favoritesService
          .loadEntries()
          .pipe(map((entries) => FavoritesActions.loadSuccess({ entries }))),
      ),
    ),
  );

  readonly resolveItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        FavoritesActions.loadSuccess,
        FavoritesActions.add,
        FavoritesActions.remove,
        FavoritesActions.toggle,
      ),
      withLatestFrom(this.store.select(selectFavoriteEntries)),
      switchMap(([, entries]) =>
        this.favoritesService.resolve(entries).pipe(
          map((items) => FavoritesActions.itemsResolved({ items })),
          catchError(() =>
            of(
              FavoritesActions.resolveFailure({
                error: 'No pudimos cargar tus favoritos.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly persist$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          FavoritesActions.add,
          FavoritesActions.remove,
          FavoritesActions.toggle,
          FavoritesActions.clear,
        ),
        withLatestFrom(this.store.select(selectFavoriteEntries)),
        tap(([, entries]) => this.favoritesService.persist(entries)),
      ),
    { dispatch: false },
  );
}
