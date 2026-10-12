import { createReducer, on } from '@ngrx/store';

import { Article } from '../../../core/models/article.model';
import { HomeStatus } from '../models/home.model';
import { HomeActions } from './home.actions';

export const HOME_FEATURE_KEY = 'home';

export interface HomeState {
  readonly cover: Article | null;
  readonly highlights: readonly Article[];
  readonly status: HomeStatus;
  readonly error: string | null;
}

export const initialHomeState: HomeState = {
  cover: null,
  highlights: [],
  status: 'idle',
  error: null,
};

export const homeReducer = createReducer(
  initialHomeState,
  on(HomeActions.loadContent, (state): HomeState => ({
    ...state,
    status: 'loading',
    error: null,
  })),
  on(HomeActions.loadContentSuccess, (state, { content }): HomeState => ({
    ...state,
    cover: content.cover,
    highlights: content.highlights,
    status: 'loaded',
    error: null,
  })),
  on(HomeActions.loadContentFailure, (state, { error }): HomeState => ({
    ...state,
    status: 'error',
    error,
  })),
);
