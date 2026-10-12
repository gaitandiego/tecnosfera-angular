import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { HomeContent } from '../models/home.model';

export const HomeActions = createActionGroup({
  source: 'Home',
  events: {
    'Load Content': emptyProps(),
    'Load Content Success': props<{ content: HomeContent }>(),
    'Load Content Failure': props<{ error: string }>(),
  },
});
