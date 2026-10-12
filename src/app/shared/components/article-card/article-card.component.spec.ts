import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { Article } from '../../../core/models/article.model';
import { FavoritesActions } from '../../../features/favorites/store/favorites.actions';
import { selectFavoriteEntries } from '../../../features/favorites/store/favorites.selectors';
import { ArticleCardComponent } from './article-card.component';

describe('ArticleCardComponent', () => {
  let fixture: ComponentFixture<ArticleCardComponent>;

  const article: Article = {
    id: '42',
    title: 'IPv6 llega a los hogares colombianos',
    summary: 'Los operadores inician la asignación de prefijos residenciales.',
    content: [{ type: 'p', text: 'Contenido' }],
    category: 'networks',
    author: 'Redacción Tecnosfera',
    date: '2026-09-11',
    readingTime: 6,
    image: null,
    caption: '',
    cover: false,
    featured: false,
  };

  let store: MockStore;
  let dispatch: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleCardComponent],
      providers: [provideRouter([]), provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectFavoriteEntries, []);
    dispatch = spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ArticleCardComponent);
    fixture.componentRef.setInput('article', article);
    fixture.detectChanges();
  });

  it('shows the title, the summary and the category label', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('.card__title')?.textContent).toContain(article.title);
    expect(element.querySelector('.card__text')?.textContent).toContain(article.summary);
    expect(element.querySelector('.card__cat')?.textContent?.trim()).toBe('REDES');
  });

  it('links to the article detail route', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a.btn');

    expect(link.getAttribute('href')).toBe('/noticias/42');
  });

  it('dispatches the favorite toggle from the heart button', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '[data-testid="card-favorite-toggle"]',
    );
    button.click();

    expect(dispatch).toHaveBeenCalledWith(FavoritesActions.toggle({ articleId: '42' }));
  });

  afterEach(() => store.resetSelectors());
});
