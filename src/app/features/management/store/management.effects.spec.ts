import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';

import { Article, ArticleDraft } from '../../../core/models/article.model';
import { PendingDeletion } from '../models/management.model';
import { ManagementService } from '../services/management.service';
import { ManagementActions } from './management.actions';
import { ManagementEffects } from './management.effects';
import { selectPendingDeletion } from './management.selectors';

describe('ManagementEffects', () => {
  let actions$: Observable<unknown>;
  let effects: ManagementEffects;
  let store: MockStore;
  let managementService: jasmine.SpyObj<ManagementService>;
  let pending: MemoizedSelector<Record<string, unknown>, PendingDeletion | null>;

  const article = { id: '1', title: 'Noticia' } as Article;
  const draft: ArticleDraft = {
    title: 'Nueva noticia',
    category: 'networks',
    image: null,
    summary: 'Resumen',
    content: 'Contenido',
    author: 'admin@tecnosfera.co',
  };

  beforeEach(() => {
    managementService = jasmine.createSpyObj<ManagementService>('ManagementService', [
      'list',
      'create',
      'remove',
    ]);

    TestBed.configureTestingModule({
      providers: [
        ManagementEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: ManagementService, useValue: managementService },
      ],
    });

    store = TestBed.inject(MockStore);
    pending = store.overrideSelector(selectPendingDeletion, null);
    effects = TestBed.inject(ManagementEffects);
  });

  it('maps the loaded collection to loadArticlesSuccess', (done) => {
    managementService.list.and.returnValue(of([article]));
    actions$ = of(ManagementActions.loadArticles());

    effects.loadArticles$.subscribe((action) => {
      expect(action).toEqual(ManagementActions.loadArticlesSuccess({ articles: [article] }));
      done();
    });
  });

  it('maps a created article to createArticleSuccess', (done) => {
    managementService.create.and.returnValue(of(article));
    actions$ = of(ManagementActions.createArticle({ draft }));

    effects.createArticle$.subscribe((action) => {
      expect(managementService.create).toHaveBeenCalledWith(draft);
      expect(action).toEqual(ManagementActions.createArticleSuccess({ article }));
      done();
    });
  });

  it('maps a rejected creation to createArticleFailure', (done) => {
    managementService.create.and.returnValue(throwError(() => new Error('boom')));
    actions$ = of(ManagementActions.createArticle({ draft }));

    effects.createArticle$.subscribe((action) => {
      expect(action.type).toBe(ManagementActions.createArticleFailure.type);
      done();
    });
  });

  it('deletes the article that is awaiting confirmation', (done) => {
    pending.setResult({ id: '7', title: 'Noticia' });
    store.refreshState();
    managementService.remove.and.returnValue(of('7'));
    actions$ = of(ManagementActions.confirmDelete());

    effects.confirmDelete$.subscribe((action) => {
      expect(managementService.remove).toHaveBeenCalledWith('7');
      expect(action).toEqual(ManagementActions.deleteArticleSuccess({ id: '7' }));
      done();
    });
  });

  it('does nothing when there is nothing awaiting confirmation', (done) => {
    pending.setResult(null);
    store.refreshState();
    actions$ = of(ManagementActions.confirmDelete());

    let emitted = false;
    effects.confirmDelete$.subscribe({
      next: () => (emitted = true),
      complete: () => {
        expect(emitted).toBeFalse();
        expect(managementService.remove).not.toHaveBeenCalled();
        done();
      },
    });
  });

  afterEach(() => store.resetSelectors());

});
