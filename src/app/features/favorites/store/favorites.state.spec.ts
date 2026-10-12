import { Article } from '../../../core/models/article.model';
import { FavoriteEntry, FavoriteItem } from '../models/favorite.model';
import { FavoritesActions } from './favorites.actions';
import {
  FavoritesState,
  favoritesReducer,
  initialFavoritesState,
} from './favorites.state';

describe('favoritesReducer', () => {
  const article = { id: '1', title: 'Noticia' } as Article;
  const entry: FavoriteEntry = { articleId: '1', savedAt: '2026-09-10T00:00:00.000Z' };
  const item: FavoriteItem = { article, savedAt: entry.savedAt };

  it('returns the initial state for an unknown action', () => {
    expect(favoritesReducer(undefined, { type: 'unknown' })).toEqual(initialFavoritesState);
  });

  it('stores the loaded entries', () => {
    const state = favoritesReducer(
      initialFavoritesState,
      FavoritesActions.loadSuccess({ entries: [entry] }),
    );

    expect(state.entries).toEqual([entry]);
  });

  it('adds an entry at the top of the list', () => {
    const state = favoritesReducer(
      { ...initialFavoritesState, entries: [entry] },
      FavoritesActions.add({ articleId: '2' }),
    );

    expect(state.entries.length).toBe(2);
    expect(state.entries[0].articleId).toBe('2');
  });

  it('does not add the same article twice', () => {
    const state = favoritesReducer(
      { ...initialFavoritesState, entries: [entry] },
      FavoritesActions.add({ articleId: '1' }),
    );

    expect(state.entries).toEqual([entry]);
  });

  it('removes the entry and its resolved item', () => {
    const previous: FavoritesState = {
      ...initialFavoritesState,
      entries: [entry],
      items: [item],
    };

    const state = favoritesReducer(previous, FavoritesActions.remove({ articleId: '1' }));

    expect(state.entries).toEqual([]);
    expect(state.items).toEqual([]);
  });

  it('toggle adds an article that is not saved yet', () => {
    const state = favoritesReducer(
      initialFavoritesState,
      FavoritesActions.toggle({ articleId: '5' }),
    );

    expect(state.entries.map((current) => current.articleId)).toEqual(['5']);
  });

  it('toggle removes an article that is already saved', () => {
    const previous: FavoritesState = {
      ...initialFavoritesState,
      entries: [entry],
      items: [item],
    };

    const state = favoritesReducer(previous, FavoritesActions.toggle({ articleId: '1' }));

    expect(state.entries).toEqual([]);
    expect(state.items).toEqual([]);
  });

  it('clears entries and items', () => {
    const previous: FavoritesState = {
      ...initialFavoritesState,
      entries: [entry],
      items: [item],
    };

    const state = favoritesReducer(previous, FavoritesActions.clear());

    expect(state.entries).toEqual([]);
    expect(state.items).toEqual([]);
    expect(state.status).toBe('loaded');
  });

  it('stores the resolved items and marks the slice as loaded', () => {
    const state = favoritesReducer(
      { ...initialFavoritesState, status: 'loading' },
      FavoritesActions.itemsResolved({ items: [item] }),
    );

    expect(state.items).toEqual([item]);
    expect(state.status).toBe('loaded');
  });

  it('stores the error message on a failed resolution', () => {
    const state = favoritesReducer(
      initialFavoritesState,
      FavoritesActions.resolveFailure({ error: 'Falló' }),
    );

    expect(state.status).toBe('error');
    expect(state.error).toBe('Falló');
  });
});
