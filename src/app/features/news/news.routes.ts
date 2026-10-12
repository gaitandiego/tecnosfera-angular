import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { NewsEffects } from './store/news.effects';
import { NEWS_FEATURE_KEY, newsReducer } from './store/news.state';

export const NEWS_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideState({ name: NEWS_FEATURE_KEY, reducer: newsReducer }),
      provideEffects(NewsEffects),
    ],
    children: [
      {
        path: '',
        title: 'Noticias — Tecnosfera',
        loadComponent: () =>
          import('./pages/news-list-page/news-list-page.component').then(
            (module) => module.NewsListPageComponent,
          ),
      },
      {
        path: ':id',
        title: 'Noticia — Tecnosfera',
        loadComponent: () =>
          import('./pages/news-detail-page/news-detail-page.component').then(
            (module) => module.NewsDetailPageComponent,
          ),
      },
    ],
  },
];
