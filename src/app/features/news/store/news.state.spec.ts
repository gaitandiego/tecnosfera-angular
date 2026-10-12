import { Article } from '../../../core/models/article.model';
import { NewsActions } from './news.actions';
import { NewsState, initialNewsState, newsReducer } from './news.state';

describe('newsReducer', () => {
  const article = { id: '1', title: 'Noticia', category: 'networks' } as Article;

  it('returns the initial state for an unknown action', () => {
    expect(newsReducer(undefined, { type: 'unknown' })).toEqual(initialNewsState);
  });

  it('marks the slice as loading and clears a previous error', () => {
    const state = newsReducer(
      { ...initialNewsState, error: 'previo' },
      NewsActions.loadArticles(),
    );

    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('stores the loaded articles', () => {
    const state = newsReducer(
      initialNewsState,
      NewsActions.loadArticlesSuccess({ articles: [article] }),
    );

    expect(state.articles).toEqual([article]);
    expect(state.status).toBe('loaded');
  });

  it('stores the error message when the load fails', () => {
    const state = newsReducer(
      initialNewsState,
      NewsActions.loadArticlesFailure({ error: 'Sin conexión' }),
    );

    expect(state.status).toBe('error');
    expect(state.error).toBe('Sin conexión');
  });

  it('resets the page when the category changes', () => {
    const previous: NewsState = { ...initialNewsState, page: 3 };

    const state = newsReducer(previous, NewsActions.changeCategory({ category: 'ai' }));

    expect(state.category).toBe('ai');
    expect(state.page).toBe(1);
  });

  it('resets the page when the search term changes', () => {
    const previous: NewsState = { ...initialNewsState, page: 2 };

    const state = newsReducer(previous, NewsActions.changeSearch({ search: 'fibra' }));

    expect(state.search).toBe('fibra');
    expect(state.page).toBe(1);
  });

  it('clears both filters', () => {
    const previous: NewsState = {
      ...initialNewsState,
      category: 'networks',
      search: 'ipv6',
      page: 4,
    };

    const state = newsReducer(previous, NewsActions.clearFilters());

    expect(state.category).toBe('all');
    expect(state.search).toBe('');
    expect(state.page).toBe(1);
  });

  it('never stores a page below one', () => {
    const state = newsReducer(initialNewsState, NewsActions.changePage({ page: -3 }));

    expect(state.page).toBe(1);
  });

  it('clears the previous article while the detail loads', () => {
    const previous: NewsState = { ...initialNewsState, selectedArticle: article };

    const state = newsReducer(previous, NewsActions.loadArticle({ id: '2' }));

    expect(state.selectedArticle).toBeNull();
    expect(state.detailStatus).toBe('loading');
  });

  it('stores the opened article', () => {
    const state = newsReducer(
      initialNewsState,
      NewsActions.loadArticleSuccess({ article }),
    );

    expect(state.selectedArticle).toEqual(article);
    expect(state.detailStatus).toBe('loaded');
  });

  it('stores the detail error', () => {
    const state = newsReducer(
      initialNewsState,
      NewsActions.loadArticleFailure({ error: 'No encontramos la noticia solicitada.' }),
    );

    expect(state.selectedArticle).toBeNull();
    expect(state.detailStatus).toBe('error');
    expect(state.detailError).toBe('No encontramos la noticia solicitada.');
  });

  it('resets the detail when leaving the screen', () => {
    const previous: NewsState = {
      ...initialNewsState,
      selectedArticle: article,
      detailStatus: 'loaded',
    };

    const state = newsReducer(previous, NewsActions.leaveDetail());

    expect(state.selectedArticle).toBeNull();
    expect(state.detailStatus).toBe('idle');
  });
});
