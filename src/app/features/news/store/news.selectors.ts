import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Article } from '../../../core/models/article.model';
import { ALL_CATEGORIES } from '../../../core/models/category.model';
import { NEWS_FEATURE_KEY, NewsState } from './news.state';

const selectNewsState = createFeatureSelector<NewsState>(NEWS_FEATURE_KEY);

export const selectAllArticles = createSelector(selectNewsState, (state) => state.articles);

export const selectNewsStatus = createSelector(selectNewsState, (state) => state.status);

export const selectNewsError = createSelector(selectNewsState, (state) => state.error);

export const selectIsLoadingNews = createSelector(
  selectNewsStatus,
  (status) => status === 'loading',
);

export const selectSelectedCategory = createSelector(
  selectNewsState,
  (state) => state.category,
);

export const selectSearchTerm = createSelector(selectNewsState, (state) => state.search);

export const selectCurrentPage = createSelector(selectNewsState, (state) => state.page);

export const selectPageSize = createSelector(selectNewsState, (state) => state.pageSize);

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const selectFilteredArticles = createSelector(
  selectAllArticles,
  selectSelectedCategory,
  selectSearchTerm,
  (articles, category, search): readonly Article[] => {
    const term = normalize(search.trim());

    return articles.filter((article) => {
      const matchesCategory =
        category === ALL_CATEGORIES || article.category === category;
      const matchesSearch =
        term.length === 0 ||
        normalize(article.title).includes(term) ||
        normalize(article.summary).includes(term);

      return matchesCategory && matchesSearch;
    });
  },
);

export const selectFilteredCount = createSelector(
  selectFilteredArticles,
  (articles) => articles.length,
);

export const selectTotalPages = createSelector(
  selectFilteredCount,
  selectPageSize,
  (count, pageSize) => Math.max(1, Math.ceil(count / pageSize)),
);

export const selectPagedArticles = createSelector(
  selectFilteredArticles,
  selectCurrentPage,
  selectPageSize,
  selectTotalPages,
  (articles, page, pageSize, totalPages): readonly Article[] => {
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * pageSize;

    return articles.slice(start, start + pageSize);
  },
);

export const selectPageNumbers = createSelector(selectTotalPages, (totalPages) =>
  Array.from({ length: totalPages }, (_, index) => index + 1),
);

export const selectHasPreviousPage = createSelector(
  selectCurrentPage,
  (page) => page > 1,
);

export const selectHasNextPage = createSelector(
  selectCurrentPage,
  selectTotalPages,
  (page, totalPages) => page < totalPages,
);

export const selectNoResults = createSelector(
  selectFilteredCount,
  selectNewsStatus,
  (count, status) => status === 'loaded' && count === 0,
);

export const selectSelectedArticle = createSelector(
  selectNewsState,
  (state) => state.selectedArticle,
);

export const selectDetailStatus = createSelector(
  selectNewsState,
  (state) => state.detailStatus,
);

export const selectDetailError = createSelector(
  selectNewsState,
  (state) => state.detailError,
);
