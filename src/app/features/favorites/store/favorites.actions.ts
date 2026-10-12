import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { FavoriteEntry, FavoriteItem } from '../models/favorite.model';

export const FavoritesActions = createActionGroup({
  source: 'Favorites',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ entries: FavoriteEntry[] }>(),
    Add: props<{ articleId: string }>(),
    Remove: props<{ articleId: string }>(),
    Toggle: props<{ articleId: string }>(),
    Clear: emptyProps(),
    'Items Resolved': props<{ items: FavoriteItem[] }>(),
    'Resolve Failure': props<{ error: string }>(),
  },
});
