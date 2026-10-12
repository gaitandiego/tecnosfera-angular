import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Article } from '../../../core/models/article.model';
import { CategoryFilter } from '../../../core/models/category.model';

export const NewsActions = createActionGroup({
  source: 'News',
  events: {
    'Load Articles': emptyProps(),
    'Load Articles Success': props<{ articles: Article[] }>(),
    'Load Articles Failure': props<{ error: string }>(),
    'Change Category': props<{ category: CategoryFilter }>(),
    'Change Search': props<{ search: string }>(),
    'Clear Filters': emptyProps(),
    'Change Page': props<{ page: number }>(),
    'Load Article': props<{ id: string }>(),
    'Load Article Success': props<{ article: Article }>(),
    'Load Article Failure': props<{ error: string }>(),
    'Leave Detail': emptyProps(),
  },
});
