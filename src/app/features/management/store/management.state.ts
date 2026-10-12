import { createReducer, on } from '@ngrx/store';

import { Article } from '../../../core/models/article.model';
import {
  ManagementOperation,
  ManagementStatus,
  PendingDeletion,
} from '../models/management.model';
import { ManagementActions } from './management.actions';

export const MANAGEMENT_FEATURE_KEY = 'management';

export interface ManagementState {
  readonly articles: readonly Article[];
  readonly status: ManagementStatus;
  readonly error: string | null;
  readonly operation: ManagementOperation;

  readonly pendingDeletion: PendingDeletion | null;

  readonly notice: string | null;
}

export const initialManagementState: ManagementState = {
  articles: [],
  status: 'idle',
  error: null,
  operation: 'idle',
  pendingDeletion: null,
  notice: null,
};

export const managementReducer = createReducer(
  initialManagementState,
  on(ManagementActions.loadArticles, (state): ManagementState => ({
    ...state,
    status: 'loading',
    error: null,
  })),
  on(ManagementActions.loadArticlesSuccess, (state, { articles }): ManagementState => ({
    ...state,
    articles,
    status: 'loaded',
  })),
  on(ManagementActions.loadArticlesFailure, (state, { error }): ManagementState => ({
    ...state,
    status: 'error',
    error,
  })),
  on(ManagementActions.createArticle, (state): ManagementState => ({
    ...state,
    operation: 'creating',
    error: null,
    notice: null,
  })),
  on(ManagementActions.createArticleSuccess, (state, { article }): ManagementState => ({
    ...state,
    articles: [article, ...state.articles],
    operation: 'done',
    notice: 'Noticia creada correctamente',
  })),
  on(ManagementActions.createArticleFailure, (state, { error }): ManagementState => ({
    ...state,
    operation: 'error',
    error,
  })),
  on(ManagementActions.askDeleteConfirmation, (state, { pending }): ManagementState => ({
    ...state,
    pendingDeletion: pending,
    notice: null,
  })),
  on(ManagementActions.cancelDelete, (state): ManagementState => ({
    ...state,
    pendingDeletion: null,
  })),
  on(ManagementActions.confirmDelete, (state): ManagementState => ({
    ...state,
    operation: 'deleting',
    error: null,
  })),
  on(ManagementActions.deleteArticleSuccess, (state, { id }): ManagementState => ({
    ...state,
    articles: state.articles.filter((article) => article.id !== id),
    pendingDeletion: null,
    operation: 'done',
    notice: 'Noticia eliminada',
  })),
  on(ManagementActions.deleteArticleFailure, (state, { error }): ManagementState => ({
    ...state,
    operation: 'error',
    pendingDeletion: null,
    error,
  })),
  on(ManagementActions.dismissNotice, (state): ManagementState => ({
    ...state,
    notice: null,
    error: null,
    operation: 'idle',
  })),
);
