import { Article } from '../../../core/models/article.model';

export type HomeStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface HomeContent {

  readonly cover: Article | null;

  readonly highlights: readonly Article[];
}

export const HOME_HIGHLIGHTS_LIMIT = 3;
