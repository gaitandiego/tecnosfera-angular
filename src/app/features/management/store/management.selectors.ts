import { createFeatureSelector, createSelector } from '@ngrx/store';

import { MANAGEMENT_FEATURE_KEY, ManagementState } from './management.state';

const selectManagementState =
  createFeatureSelector<ManagementState>(MANAGEMENT_FEATURE_KEY);

export const selectManagedArticles = createSelector(
  selectManagementState,
  (state) => state.articles,
);

export const selectManagementStatus = createSelector(
  selectManagementState,
  (state) => state.status,
);

export const selectManagementError = createSelector(
  selectManagementState,
  (state) => state.error,
);

export const selectManagementNotice = createSelector(
  selectManagementState,
  (state) => state.notice,
);

export const selectPendingDeletion = createSelector(
  selectManagementState,
  (state) => state.pendingDeletion,
);

export const selectIsLoadingManagement = createSelector(
  selectManagementStatus,
  (status) => status === 'loading' || status === 'idle',
);

export const selectIsSaving = createSelector(
  selectManagementState,
  (state) => state.operation === 'creating' || state.operation === 'deleting',
);

export const selectManagedArticlesCount = createSelector(
  selectManagedArticles,
  (articles) => articles.length,
);
