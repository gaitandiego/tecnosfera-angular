import { createFeatureSelector, createSelector } from '@ngrx/store';

import { HOME_FEATURE_KEY, HomeState } from './home.state';

const selectHomeState = createFeatureSelector<HomeState>(HOME_FEATURE_KEY);

export const selectCoverArticle = createSelector(selectHomeState, (state) => state.cover);

export const selectHighlights = createSelector(
  selectHomeState,
  (state) => state.highlights,
);

export const selectHomeStatus = createSelector(selectHomeState, (state) => state.status);

export const selectHomeError = createSelector(selectHomeState, (state) => state.error);

export const selectIsLoadingHome = createSelector(
  selectHomeStatus,
  (status) => status === 'loading' || status === 'idle',
);
