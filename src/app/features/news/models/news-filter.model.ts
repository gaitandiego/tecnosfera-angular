import { CategoryFilter } from '../../../core/models/category.model';

export interface NewsFilter {
  readonly category: CategoryFilter;
  readonly search: string;
}

export type NewsStatus = 'idle' | 'loading' | 'loaded' | 'error';

export const NEWS_PAGE_SIZE = 6;
