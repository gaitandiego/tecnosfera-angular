import { Article } from '../../../core/models/article.model';
import { HomeActions } from './home.actions';
import { homeReducer, initialHomeState } from './home.state';

describe('homeReducer', () => {
  const cover = { id: '1', title: 'Portada' } as Article;
  const highlight = { id: '2', title: 'Destacada' } as Article;

  it('returns the initial state for an unknown action', () => {
    expect(homeReducer(undefined, { type: 'unknown' })).toEqual(initialHomeState);
  });

  it('marks the slice as loading', () => {
    const state = homeReducer(initialHomeState, HomeActions.loadContent());

    expect(state.status).toBe('loading');
  });

  it('stores the cover and the highlights', () => {
    const state = homeReducer(
      initialHomeState,
      HomeActions.loadContentSuccess({ content: { cover, highlights: [highlight] } }),
    );

    expect(state.cover).toEqual(cover);
    expect(state.highlights).toEqual([highlight]);
    expect(state.status).toBe('loaded');
  });

  it('stores the error message', () => {
    const state = homeReducer(
      initialHomeState,
      HomeActions.loadContentFailure({ error: 'Sin conexión' }),
    );

    expect(state.status).toBe('error');
    expect(state.error).toBe('Sin conexión');
  });
});
