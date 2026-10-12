import { createFeatureSelector, createSelector } from '@ngrx/store';

import { FAVORITES_FEATURE_KEY, FavoritesState } from './favorites.state';

const selectFavoritesState = createFeatureSelector<FavoritesState>(FAVORITES_FEATURE_KEY);

export const selectFavoriteEntries = createSelector(
  selectFavoritesState,
  (state) => state.entries,
);

export const selectFavoriteItems = createSelector(
  selectFavoritesState,
  (state) => state.items,
);

export const selectFavoritesStatus = createSelector(
  selectFavoritesState,
  (state) => state.status,
);

export const selectFavoritesError = createSelector(
  selectFavoritesState,
  (state) => state.error,
);

export const selectFavoritesCount = createSelector(
  selectFavoriteEntries,
  (entries) => entries.length,
);

export const selectFavoritesAreEmpty = createSelector(
  selectFavoritesCount,
  (count) => count === 0,
);

export const selectIsFavorite = (articleId: string) =>
  createSelector(selectFavoriteEntries, (entries) =>
    entries.some((entry) => entry.articleId === articleId),
  );
