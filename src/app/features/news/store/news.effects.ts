import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { NewsService } from '../services/news.service';
import { NewsActions } from './news.actions';

@Injectable()
export class NewsEffects {
  private readonly actions$ = inject(Actions);
  private readonly newsService = inject(NewsService);

  readonly loadArticles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.loadArticles),
      switchMap(() =>
        this.newsService.getArticles().pipe(
          map((articles) => NewsActions.loadArticlesSuccess({ articles })),
          catchError(() =>
            of(
              NewsActions.loadArticlesFailure({
                error: 'No pudimos cargar las noticias. Intenta de nuevo.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly loadArticle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewsActions.loadArticle),
      switchMap(({ id }) =>
        this.newsService.getArticle(id).pipe(
          map((article) => NewsActions.loadArticleSuccess({ article })),
          catchError((error: Error) =>
            of(NewsActions.loadArticleFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );
}
