import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, filter, map, of, switchMap, tap, withLatestFrom } from 'rxjs';

import { ToastService } from '../../../shared/services/toast.service';
import { FavoritesActions } from '../../favorites/store/favorites.actions';
import { ManagementService } from '../services/management.service';
import { ManagementActions } from './management.actions';
import { selectPendingDeletion } from './management.selectors';

@Injectable()
export class ManagementEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly managementService = inject(ManagementService);
  private readonly toast = inject(ToastService);

  readonly loadArticles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManagementActions.loadArticles),
      switchMap(() =>
        this.managementService.list().pipe(
          map((articles) => ManagementActions.loadArticlesSuccess({ articles })),
          catchError(() =>
            of(
              ManagementActions.loadArticlesFailure({
                error: 'No pudimos cargar las noticias.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly createArticle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManagementActions.createArticle),
      exhaustMap(({ draft }) =>
        this.managementService.create(draft).pipe(
          map((article) => ManagementActions.createArticleSuccess({ article })),
          catchError(() =>
            of(
              ManagementActions.createArticleFailure({
                error: 'No pudimos guardar la noticia.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly confirmDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManagementActions.confirmDelete),
      withLatestFrom(this.store.select(selectPendingDeletion)),
      filter(([, pending]) => pending !== null),
      exhaustMap(([, pending]) =>
        this.managementService.remove(pending!.id).pipe(
          map((id) => ManagementActions.deleteArticleSuccess({ id })),
          catchError(() =>
            of(
              ManagementActions.deleteArticleFailure({
                error: 'No pudimos eliminar la noticia.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // Si la noticia eliminada estaba en favoritos también se quita de la lista.
  readonly removeFromFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManagementActions.deleteArticleSuccess),
      map(({ id }) => FavoritesActions.remove({ articleId: id })),
    ),
  );

  // Avisos cortos de confirmación, los mismos textos del prototipo.
  readonly notify$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ManagementActions.createArticleSuccess,
          ManagementActions.deleteArticleSuccess,
        ),
        tap((action) =>
          this.toast.show(
            action.type === ManagementActions.createArticleSuccess.type
              ? 'Noticia creada correctamente'
              : 'Noticia eliminada',
          ),
        ),
      ),
    { dispatch: false },
  );
}
