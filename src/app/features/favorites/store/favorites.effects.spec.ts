import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';

import { Article } from '../../../core/models/article.model';
import { FavoriteEntry, FavoriteItem } from '../models/favorite.model';
import { FavoritesService } from '../services/favorites.service';
import { FavoritesActions } from './favorites.actions';
import { FavoritesEffects } from './favorites.effects';
import { selectFavoriteEntries } from './favorites.selectors';

describe('FavoritesEffects', () => {
  let actions$: Observable<unknown>;
  let effects: FavoritesEffects;
  let favoritesService: jasmine.SpyObj<FavoritesService>;
  let store: MockStore;

  const entries: FavoriteEntry[] = [
    { articleId: '1', savedAt: '2026-09-10T00:00:00.000Z' },
  ];
  const items: FavoriteItem[] = [
    { article: { id: '1' } as Article, savedAt: entries[0].savedAt },
  ];

  beforeEach(() => {
    favoritesService = jasmine.createSpyObj<FavoritesService>('FavoritesService', [
      'loadEntries',
      'persist',
      'resolve',
    ]);

    TestBed.configureTestingModule({
      providers: [
        FavoritesEffects,
        provideMockActions(() => actions$),
        provideMockStore({ selectors: [{ selector: selectFavoriteEntries, value: entries }] }),
        { provide: FavoritesService, useValue: favoritesService },
      ],
    });

    effects = TestBed.inject(FavoritesEffects);
    store = TestBed.inject(MockStore);
  });

  it('maps the persisted entries to loadSuccess', (done) => {
    favoritesService.loadEntries.and.returnValue(of(entries));
    actions$ = of(FavoritesActions.load());

    effects.load$.subscribe((action) => {
      expect(action).toEqual(FavoritesActions.loadSuccess({ entries }));
      done();
    });
  });

  it('resolves the entries into items after a change', (done) => {
    favoritesService.resolve.and.returnValue(of(items));
    actions$ = of(FavoritesActions.add({ articleId: '1' }));

    effects.resolveItems$.subscribe((action) => {
      expect(favoritesService.resolve).toHaveBeenCalledWith(entries);
      expect(action).toEqual(FavoritesActions.itemsResolved({ items }));
      done();
    });
  });

  it('emits a failure action when the resolution fails', (done) => {
    favoritesService.resolve.and.returnValue(throwError(() => new Error('boom')));
    actions$ = of(FavoritesActions.toggle({ articleId: '1' }));

    effects.resolveItems$.subscribe((action) => {
      expect(action.type).toBe(FavoritesActions.resolveFailure.type);
      done();
    });
  });

  it('persists the entries after a change', (done) => {
    actions$ = of(FavoritesActions.clear());

    effects.persist$.subscribe(() => {
      expect(favoritesService.persist).toHaveBeenCalledWith(entries);
      done();
    });
  });

  afterEach(() => store.resetSelectors());
});
