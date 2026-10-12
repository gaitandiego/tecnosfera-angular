import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { ManagementEffects } from './store/management.effects';
import { MANAGEMENT_FEATURE_KEY, managementReducer } from './store/management.state';

export const MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    title: 'Gestión de noticias — Tecnosfera',
    providers: [
      provideState({ name: MANAGEMENT_FEATURE_KEY, reducer: managementReducer }),
      provideEffects(ManagementEffects),
    ],
    loadComponent: () =>
      import('./pages/management-page/management-page.component').then(
        (module) => module.ManagementPageComponent,
      ),
  },
];
