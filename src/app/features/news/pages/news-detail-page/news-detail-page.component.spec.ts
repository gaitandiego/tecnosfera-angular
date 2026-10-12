import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { Article } from '../../../../core/models/article.model';
import { NewsStatus } from '../../models/news-filter.model';
import { FavoriteEntry } from '../../../favorites/models/favorite.model';
import { FavoritesActions } from '../../../favorites/store/favorites.actions';
import { selectFavoriteEntries } from '../../../favorites/store/favorites.selectors';
import { NewsActions } from '../../store/news.actions';
import {
  selectDetailError,
  selectDetailStatus,
  selectSelectedArticle,
} from '../../store/news.selectors';
import { NewsDetailPageComponent } from './news-detail-page.component';

describe('NewsDetailPageComponent', () => {
  let fixture: ComponentFixture<NewsDetailPageComponent>;
  let store: MockStore;
  let dispatch: jasmine.Spy;
  let favorites: MemoizedSelector<Record<string, unknown>, readonly FavoriteEntry[]>;
  let detailStatus: MemoizedSelector<Record<string, unknown>, NewsStatus>;
  let detailError: MemoizedSelector<Record<string, unknown>, string | null>;

  const article: Article = {
    id: '2',
    title: 'IPv6 llega a los hogares colombianos',
    summary: 'Los operadores inician la asignación de prefijos.',
    content: [
      { type: 'p', text: 'Primer párrafo.' },
      { type: 'h3', text: 'Un subtítulo' },
      { type: 'p', text: 'Segundo párrafo.' },
    ],
    category: 'networks',
    author: 'Redacción Tecnosfera',
    date: '2026-09-11',
    readingTime: 6,
    image: null,
    caption: 'Pie de foto de la noticia',
    cover: false,
    featured: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsDetailPageComponent],
      providers: [provideRouter([]), provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectSelectedArticle, article);
    detailStatus = store.overrideSelector(selectDetailStatus, 'loaded');
    detailError = store.overrideSelector(selectDetailError, null);
    favorites = store.overrideSelector(selectFavoriteEntries, []);

    dispatch = spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(NewsDetailPageComponent);
    fixture.componentRef.setInput('id', '2');
    fixture.detectChanges();
  });

  it('asks for the article that matches the route parameter', () => {
    expect(dispatch).toHaveBeenCalledWith(NewsActions.loadArticle({ id: '2' }));
  });

  it('renders the article title, author and paragraphs', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('.article__title')?.textContent).toContain(article.title);
    expect(element.querySelector('.article__by')?.textContent).toContain('Redacción Tecnosfera');
    expect(element.querySelectorAll('.article__body p').length).toBe(2);
    expect(element.querySelectorAll('.article__body h3').length).toBe(1);
    expect(element.querySelector('.article__caption')?.textContent).toContain('Pie de foto');
  });

  it('offers to save the article when it is not a favorite yet', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '[data-testid="favorite-toggle"]',
    );

    expect(button.textContent).toContain('Agregar a favoritos');
  });

  it('offers to remove the article when it is already saved', () => {
    favorites.setResult([{ articleId: '2', savedAt: '2026-09-11T00:00:00.000Z' }]);
    store.refreshState();
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '[data-testid="favorite-toggle"]',
    );

    expect(button.textContent).toContain('Quitar de favoritos');
  });

  it('dispatches the favorite toggle', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '[data-testid="favorite-toggle"]',
    );
    button.click();

    expect(dispatch).toHaveBeenCalledWith(FavoritesActions.toggle({ articleId: '2' }));
  });

  it('shows the error state when the article does not exist', () => {
    detailStatus.setResult('error');
    detailError.setResult('No encontramos la noticia solicitada.');
    store.refreshState();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.empty-state')?.textContent).toContain(
      'No encontramos la noticia solicitada.',
    );
  });

  afterEach(() => store.resetSelectors());

});
