import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { Article } from '../../../../core/models/article.model';
import { NewsActions } from '../../store/news.actions';
import { initialNewsState } from '../../store/news.state';
import {
  selectFilteredCount,
  selectIsLoadingNews,
  selectNewsError,
  selectNoResults,
  selectPagedArticles,
} from '../../store/news.selectors';
import { selectFavoriteEntries } from '../../../favorites/store/favorites.selectors';
import { NewsListPageComponent } from './news-list-page.component';

describe('NewsListPageComponent', () => {
  let fixture: ComponentFixture<NewsListPageComponent>;
  let store: MockStore;
  let dispatch: jasmine.Spy;
  let pagedArticles: MemoizedSelector<Record<string, unknown>, readonly Article[]>;
  let isLoading: MemoizedSelector<Record<string, unknown>, boolean>;
  let noResults: MemoizedSelector<Record<string, unknown>, boolean>;
  let error: MemoizedSelector<Record<string, unknown>, string | null>;

  const articles: Article[] = [
    { id: '1', title: 'Fibra óptica rural', summary: 'Resumen', category: 'technology' } as Article,
    { id: '2', title: 'IPv6 en los hogares', summary: 'Resumen', category: 'networks' } as Article,
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsListPageComponent],
      providers: [
        provideRouter([]),
        provideMockStore({ initialState: { news: { ...initialNewsState, articles } } }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    pagedArticles = store.overrideSelector(selectPagedArticles, articles);
    isLoading = store.overrideSelector(selectIsLoadingNews, false);
    noResults = store.overrideSelector(selectNoResults, false);
    error = store.overrideSelector(selectNewsError, null);
    store.overrideSelector(selectFavoriteEntries, []);
    store.overrideSelector(selectFilteredCount, articles.length);

    dispatch = spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(NewsListPageComponent);
    fixture.detectChanges();
  });

  it('asks for the collection on init', () => {
    expect(dispatch).toHaveBeenCalledWith(NewsActions.loadArticles());
  });

  it('renders one card per article on the current page', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-article-card');

    expect(cards.length).toBe(articles.length);
  });

  it('shows the result count', () => {
    const counter: HTMLElement = fixture.nativeElement.querySelector(
      '[data-testid="results-count"]',
    );

    expect(counter.textContent?.trim()).toBe('2 resultados');
  });

  it('shows the loading state instead of the grid', () => {
    isLoading.setResult(true);
    store.refreshState();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.loading-state')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.grid-3')).toBeNull();
  });

  it('shows the empty state and clears the filters on demand', () => {
    pagedArticles.setResult([]);
    noResults.setResult(true);
    store.refreshState();
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.empty-state .btn',
    );
    button.click();

    expect(dispatch).toHaveBeenCalledWith(NewsActions.clearFilters());
  });

  it('shows the error state when the request failed', () => {
    error.setResult('Sin conexión');
    store.refreshState();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.empty-state')?.textContent).toContain(
      'Sin conexión',
    );
  });

  it('dispatches a category change from the chips', () => {
    const chip: HTMLButtonElement = fixture.nativeElement.querySelectorAll('.chip')[2];
    chip.click();

    expect(dispatch).toHaveBeenCalledWith(
      NewsActions.changeCategory({ category: 'networks' }),
    );
  });

  it('dispatches a search change from the search box', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('.search');
    input.value = 'ipv6';
    input.dispatchEvent(new Event('input'));

    expect(dispatch).toHaveBeenCalledWith(NewsActions.changeSearch({ search: 'ipv6' }));
  });

  afterEach(() => store.resetSelectors());

});
