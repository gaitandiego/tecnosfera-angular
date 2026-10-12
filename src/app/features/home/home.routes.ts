import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { HomeEffects } from './store/home.effects';
import { HOME_FEATURE_KEY, homeReducer } from './store/home.state';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    title: 'Tecnosfera — Noticias de tecnología',
    providers: [
      provideState({ name: HOME_FEATURE_KEY, reducer: homeReducer }),
      provideEffects(HomeEffects),
    ],
    loadComponent: () =>
      import('./pages/home-page/home-page.component').then(
        (module) => module.HomePageComponent,
      ),
  },
];
