import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';

import { Article } from '../../../core/models/article.model';
import { NewsService } from '../services/news.service';
import { NewsActions } from './news.actions';
import { NewsEffects } from './news.effects';

describe('NewsEffects', () => {
  let actions$: Observable<unknown>;
  let effects: NewsEffects;
  let newsService: jasmine.SpyObj<NewsService>;

  const article = { id: '1', title: 'Noticia' } as Article;

  beforeEach(() => {
    newsService = jasmine.createSpyObj<NewsService>('NewsService', [
      'getArticles',
      'getArticle',
    ]);

    TestBed.configureTestingModule({
      providers: [
        NewsEffects,
        provideMockActions(() => actions$),
        { provide: NewsService, useValue: newsService },
      ],
    });

    effects = TestBed.inject(NewsEffects);
  });

  it('maps the loaded collection to loadArticlesSuccess', (done) => {
    newsService.getArticles.and.returnValue(of([article]));
    actions$ = of(NewsActions.loadArticles());

    effects.loadArticles$.subscribe((action) => {
      expect(action).toEqual(NewsActions.loadArticlesSuccess({ articles: [article] }));
      done();
    });
  });

  it('maps a failed collection request to loadArticlesFailure', (done) => {
    newsService.getArticles.and.returnValue(throwError(() => new Error('boom')));
    actions$ = of(NewsActions.loadArticles());

    effects.loadArticles$.subscribe((action) => {
      expect(action.type).toBe(NewsActions.loadArticlesFailure.type);
      done();
    });
  });

  it('maps a single article to loadArticleSuccess', (done) => {
    newsService.getArticle.and.returnValue(of(article));
    actions$ = of(NewsActions.loadArticle({ id: '1' }));

    effects.loadArticle$.subscribe((action) => {
      expect(newsService.getArticle).toHaveBeenCalledWith('1');
      expect(action).toEqual(NewsActions.loadArticleSuccess({ article }));
      done();
    });
  });

  it('forwards the api message on a failed detail request', (done) => {
    newsService.getArticle.and.returnValue(
      throwError(() => new Error('No encontramos la noticia solicitada.')),
    );
    actions$ = of(NewsActions.loadArticle({ id: '99' }));

    effects.loadArticle$.subscribe((action) => {
      expect(action).toEqual(
        NewsActions.loadArticleFailure({ error: 'No encontramos la noticia solicitada.' }),
      );
      done();
    });
  });
});
