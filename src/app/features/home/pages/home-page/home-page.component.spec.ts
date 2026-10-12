import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { Article } from '../../../../core/models/article.model';
import { HomeActions } from '../../store/home.actions';
import {
  selectCoverArticle,
  selectHighlights,
  selectHomeError,
  selectIsLoadingHome,
} from '../../store/home.selectors';
import { selectFavoriteEntries } from '../../../favorites/store/favorites.selectors';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let fixture: ComponentFixture<HomePageComponent>;
  let store: MockStore;
  let dispatch: jasmine.Spy;
  let isLoading: MemoizedSelector<Record<string, unknown>, boolean>;
  let error: MemoizedSelector<Record<string, unknown>, string | null>;

  const cover: Article = {
    id: '1',
    title: 'La fibra óptica que está cambiando la conectividad rural',
    summary: 'Un recorrido por los despliegues FTTH.',
    content: [{ type: 'p', text: 'Cuerpo de la noticia' }],
    category: 'technology',
    author: 'Redacción',
    date: '2026-09-12',
    readingTime: 7,
    image: null,
    caption: '',
    cover: true,
    featured: true,
  };

  const highlights: Article[] = [
    { ...cover, id: '2', title: 'IPv6 llega a los hogares' },
    { ...cover, id: '3', title: 'Modelos abiertos en español' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [provideRouter([]), provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectCoverArticle, cover);
    store.overrideSelector(selectHighlights, highlights);
    isLoading = store.overrideSelector(selectIsLoadingHome, false);
    error = store.overrideSelector(selectHomeError, null);
    store.overrideSelector(selectFavoriteEntries, []);

    dispatch = spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();
  });

  it('asks for the home content on init', () => {
    expect(dispatch).toHaveBeenCalledWith(HomeActions.loadContent());
  });

  it('renders the cover article', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('.hero__title')?.textContent).toContain(cover.title);
    expect(element.querySelector('.hero__lead')?.textContent).toContain(cover.summary);
    expect(element.querySelector('.hero .btn')?.getAttribute('href')).toBe('/noticias/1');
  });

  it('renders one card per highlight', () => {
    expect(fixture.nativeElement.querySelectorAll('app-article-card').length).toBe(2);
  });

  it('shows the loading state instead of the content', () => {
    isLoading.setResult(true);
    store.refreshState();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.loading-state')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.hero')).toBeNull();
  });

  it('shows the error state when the request failed', () => {
    error.setResult('Sin conexión');
    store.refreshState();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.empty-state')?.textContent).toContain(
      'Sin conexión',
    );
  });

  afterEach(() => store.resetSelectors());

});
