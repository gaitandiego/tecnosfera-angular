import { Article } from '../../../core/models/article.model';
import {
  selectFilteredArticles,
  selectFilteredCount,
  selectHasNextPage,
  selectHasPreviousPage,
  selectNoResults,
  selectPageNumbers,
  selectPagedArticles,
  selectTotalPages,
} from './news.selectors';
import { NewsState, initialNewsState } from './news.state';

describe('news selectors', () => {
  const article = (id: string, title: string, category: Article['category']): Article =>
    ({
      id,
      title,
      summary: `Resumen de ${title}`,
      content: [{ type: 'p', text: 'Cuerpo' }],
      category,
      author: 'Redacción',
      date: `2026-09-${id.padStart(2, '0')}`,
      readingTime: 4,
      image: null,
      caption: '',
      cover: false,
      featured: false,
    }) as Article;

  const articles: Article[] = [
    article('1', 'Fibra óptica rural', 'technology'),
    article('2', 'IPv6 en los hogares', 'networks'),
    article('3', 'Wi-Fi 7 en Colombia', 'networks'),
    article('4', 'Blindar tu red doméstica', 'security'),
    article('5', 'Modelos abiertos', 'ai'),
    article('6', 'Centros de datos', 'technology'),
    article('7', 'BGP para operadores', 'networks'),
  ];

  const state = (overrides: Partial<NewsState> = {}) => ({
    news: { ...initialNewsState, articles, ...overrides },
  });

  it('returns every article when no filter is applied', () => {
    expect(selectFilteredCount(state())).toBe(articles.length);
  });

  it('filters by category', () => {
    const result = selectFilteredArticles(state({ category: 'networks' }));

    expect(result.map((current) => current.id)).toEqual(['2', '3', '7']);
  });

  it('filters by search term, ignoring case and accents', () => {
    const result = selectFilteredArticles(state({ search: 'FIBRA OPTICA' }));

    expect(result.map((current) => current.id)).toEqual(['1']);
  });

  it('searches in the summary as well as the title', () => {
    const result = selectFilteredArticles(state({ search: 'Resumen de Centros' }));

    expect(result.map((current) => current.id)).toEqual(['6']);
  });

  it('combines category and search', () => {
    const result = selectFilteredArticles(state({ category: 'networks', search: 'wi-fi' }));

    expect(result.map((current) => current.id)).toEqual(['3']);
  });

  it('splits the filtered articles into pages', () => {
    const first = selectPagedArticles(state({ pageSize: 3, page: 1 }));
    const second = selectPagedArticles(state({ pageSize: 3, page: 2 }));

    expect(first.map((current) => current.id)).toEqual(['1', '2', '3']);
    expect(second.map((current) => current.id)).toEqual(['4', '5', '6']);
  });

  it('clamps a page number beyond the last page', () => {
    const result = selectPagedArticles(state({ pageSize: 3, page: 99 }));

    expect(result.map((current) => current.id)).toEqual(['7']);
  });

  it('computes the total number of pages', () => {
    expect(selectTotalPages(state({ pageSize: 3 }))).toBe(3);
    expect(selectTotalPages(state({ articles: [], pageSize: 3 }))).toBe(1);
  });

  it('lists the page numbers', () => {
    expect(selectPageNumbers(state({ pageSize: 3 }))).toEqual([1, 2, 3]);
  });

  it('reports the available navigation directions', () => {
    expect(selectHasPreviousPage(state({ page: 1 }))).toBeFalse();
    expect(selectHasPreviousPage(state({ page: 2 }))).toBeTrue();
    expect(selectHasNextPage(state({ pageSize: 3, page: 3 }))).toBeFalse();
    expect(selectHasNextPage(state({ pageSize: 3, page: 2 }))).toBeTrue();
  });

  it('reports an empty result only once the collection was loaded', () => {
    expect(selectNoResults(state({ status: 'loaded', search: 'no existe' }))).toBeTrue();
    expect(selectNoResults(state({ status: 'loading', search: 'no existe' }))).toBeFalse();
  });
});
