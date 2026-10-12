import { Article } from '../../../core/models/article.model';

export interface FavoriteEntry {
  readonly articleId: string;

  readonly savedAt: string;
}

export interface FavoriteItem {
  readonly article: Article;
  readonly savedAt: string;
}

export type FavoritesStatus = 'idle' | 'loading' | 'loaded' | 'error';
