import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { Article } from '../../../../core/models/article.model';
import { FavoriteItem } from '../../models/favorite.model';
import { FavoritesActions } from '../../store/favorites.actions';
import {
  selectFavoriteItems,
  selectFavoritesAreEmpty,
  selectFavoritesCount,
  selectFavoritesStatus,
} from '../../store/favorites.selectors';
import { FavoritesPageComponent } from './favorites-page.component';

describe('FavoritesPageComponent', () => {
  let fixture: ComponentFixture<FavoritesPageComponent>;
  let store: MockStore;
  let dispatch: jasmine.Spy;
  let items: MemoizedSelector<Record<string, unknown>, readonly FavoriteItem[]>;
  let isEmpty: MemoizedSelector<Record<string, unknown>, boolean>;
  let count: MemoizedSelector<Record<string, unknown>, number>;

  const saved: FavoriteItem[] = [
    {
      article: {
        id: '2',
        title: 'IPv6 llega a los hogares',
        category: 'networks',
        date: '2026-09-11',
        image: null,
      } as Article,
      savedAt: '2026-09-11T00:00:00.000Z',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesPageComponent],
      providers: [provideRouter([]), provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    items = store.overrideSelector(selectFavoriteItems, saved);
    count = store.overrideSelector(selectFavoritesCount, 1);
    isEmpty = store.overrideSelector(selectFavoritesAreEmpty, false);
    store.overrideSelector(selectFavoritesStatus, 'loaded');

    dispatch = spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(FavoritesPageComponent);
    fixture.detectChanges();
  });

  it('renders one row per saved article', () => {
    const rows = fixture.nativeElement.querySelectorAll('.fav-item');

    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('IPv6 llega a los hogares');
  });

  it('uses the singular form for a single saved article', () => {
    const counter: HTMLElement = fixture.nativeElement.querySelector(
      '[data-testid="favorites-count"]',
    );

    expect(counter.textContent?.trim()).toBe('1 noticia guardada');
  });

  it('uses the plural form for several saved articles', () => {
    count.setResult(3);
    store.refreshState();
    fixture.detectChanges();

    const counter: HTMLElement = fixture.nativeElement.querySelector(
      '[data-testid="favorites-count"]',
    );

    expect(counter.textContent?.trim()).toBe('3 noticias guardadas');
  });

  it('dispatches the removal of one article', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.fav-item__actions .btn--accent-line',
    );
    button.click();

    expect(dispatch).toHaveBeenCalledWith(FavoritesActions.remove({ articleId: '2' }));
  });

  it('dispatches the list reset once the user confirms', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.page-head--row .btn',
    );
    button.click();

    expect(dispatch).toHaveBeenCalledWith(FavoritesActions.clear());
  });

  it('shows the empty state when nothing is saved', () => {
    items.setResult([]);
    isEmpty.setResult(true);
    count.setResult(0);
    store.refreshState();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.empty-state')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.fav-list')).toBeNull();
  });

  afterEach(() => store.resetSelectors());

});
