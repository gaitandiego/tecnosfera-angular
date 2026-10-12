import { createReducer, on } from '@ngrx/store';

import { Article } from '../../../core/models/article.model';
import { ALL_CATEGORIES, CategoryFilter } from '../../../core/models/category.model';
import { NEWS_PAGE_SIZE, NewsStatus } from '../models/news-filter.model';
import { NewsActions } from './news.actions';

export const NEWS_FEATURE_KEY = 'news';

export interface NewsState {
  readonly articles: readonly Article[];
  readonly status: NewsStatus;
  readonly error: string | null;
  readonly category: CategoryFilter;
  readonly search: string;
  readonly page: number;
  readonly pageSize: number;
  readonly selectedArticle: Article | null;
  readonly detailStatus: NewsStatus;
  readonly detailError: string | null;
}

export const initialNewsState: NewsState = {
  articles: [],
  status: 'idle',
  error: null,
  category: ALL_CATEGORIES,
  search: '',
  page: 1,
  pageSize: NEWS_PAGE_SIZE,
  selectedArticle: null,
  detailStatus: 'idle',
  detailError: null,
};

export const newsReducer = createReducer(
  initialNewsState,
  on(NewsActions.loadArticles, (state): NewsState => ({
    ...state,
    status: 'loading',
    error: null,
  })),
  on(NewsActions.loadArticlesSuccess, (state, { articles }): NewsState => ({
    ...state,
    articles,
    status: 'loaded',
    error: null,
  })),
  on(NewsActions.loadArticlesFailure, (state, { error }): NewsState => ({
    ...state,
    status: 'error',
    error,
  })),

  on(NewsActions.changeCategory, (state, { category }): NewsState => ({
    ...state,
    category,
    page: 1,
  })),
  on(NewsActions.changeSearch, (state, { search }): NewsState => ({
    ...state,
    search,
    page: 1,
  })),
  on(NewsActions.clearFilters, (state): NewsState => ({
    ...state,
    category: ALL_CATEGORIES,
    search: '',
    page: 1,
  })),
  on(NewsActions.changePage, (state, { page }): NewsState => ({
    ...state,
    page: Math.max(1, page),
  })),
  on(NewsActions.loadArticle, (state): NewsState => ({
    ...state,
    selectedArticle: null,
    detailStatus: 'loading',
    detailError: null,
  })),
  on(NewsActions.loadArticleSuccess, (state, { article }): NewsState => ({
    ...state,
    selectedArticle: article,
    detailStatus: 'loaded',
    detailError: null,
  })),
  on(NewsActions.loadArticleFailure, (state, { error }): NewsState => ({
    ...state,
    selectedArticle: null,
    detailStatus: 'error',
    detailError: error,
  })),
  on(NewsActions.leaveDetail, (state): NewsState => ({
    ...state,
    selectedArticle: null,
    detailStatus: 'idle',
    detailError: null,
  })),
);
