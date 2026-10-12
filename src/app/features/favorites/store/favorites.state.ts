import { createReducer, on } from '@ngrx/store';

import { FavoriteEntry, FavoriteItem, FavoritesStatus } from '../models/favorite.model';
import { FavoritesActions } from './favorites.actions';

export const FAVORITES_FEATURE_KEY = 'favorites';

export interface FavoritesState {

  readonly entries: readonly FavoriteEntry[];

  readonly items: readonly FavoriteItem[];
  readonly status: FavoritesStatus;
  readonly error: string | null;
}

export const initialFavoritesState: FavoritesState = {
  entries: [],
  items: [],
  status: 'idle',
  error: null,
};

const addEntry = (
  entries: readonly FavoriteEntry[],
  articleId: string,
): readonly FavoriteEntry[] =>
  entries.some((entry) => entry.articleId === articleId)
    ? entries
    : [{ articleId, savedAt: new Date().toISOString() }, ...entries];

const removeEntry = (
  entries: readonly FavoriteEntry[],
  articleId: string,
): readonly FavoriteEntry[] => entries.filter((entry) => entry.articleId !== articleId);

export const favoritesReducer = createReducer(
  initialFavoritesState,
  on(FavoritesActions.load, (state): FavoritesState => ({ ...state, status: 'loading' })),
  on(FavoritesActions.loadSuccess, (state, { entries }): FavoritesState => ({
    ...state,
    entries,
    status: 'loading',
    error: null,
  })),
  on(FavoritesActions.add, (state, { articleId }): FavoritesState => ({
    ...state,
    entries: addEntry(state.entries, articleId),
  })),
  on(FavoritesActions.remove, (state, { articleId }): FavoritesState => ({
    ...state,
    entries: removeEntry(state.entries, articleId),
    items: state.items.filter((item) => item.article.id !== articleId),
  })),
  on(FavoritesActions.toggle, (state, { articleId }): FavoritesState => {
    const isSaved = state.entries.some((entry) => entry.articleId === articleId);

    return {
      ...state,
      entries: isSaved
        ? removeEntry(state.entries, articleId)
        : addEntry(state.entries, articleId),
      items: isSaved
        ? state.items.filter((item) => item.article.id !== articleId)
        : state.items,
    };
  }),
  on(FavoritesActions.clear, (state): FavoritesState => ({
    ...state,
    entries: [],
    items: [],
    status: 'loaded',
  })),
  on(FavoritesActions.itemsResolved, (state, { items }): FavoritesState => ({
    ...state,
    items,
    status: 'loaded',
    error: null,
  })),
  on(FavoritesActions.resolveFailure, (state, { error }): FavoritesState => ({
    ...state,
    status: 'error',
    error,
  })),
);
