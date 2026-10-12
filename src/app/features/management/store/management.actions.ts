import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Article, ArticleDraft } from '../../../core/models/article.model';
import { PendingDeletion } from '../models/management.model';

export const ManagementActions = createActionGroup({
  source: 'Management',
  events: {
    'Load Articles': emptyProps(),
    'Load Articles Success': props<{ articles: Article[] }>(),
    'Load Articles Failure': props<{ error: string }>(),
    'Create Article': props<{ draft: ArticleDraft }>(),
    'Create Article Success': props<{ article: Article }>(),
    'Create Article Failure': props<{ error: string }>(),
    'Ask Delete Confirmation': props<{ pending: PendingDeletion }>(),
    'Cancel Delete': emptyProps(),
    'Confirm Delete': emptyProps(),
    'Delete Article Success': props<{ id: string }>(),
    'Delete Article Failure': props<{ error: string }>(),
    'Dismiss Notice': emptyProps(),
  },
});
