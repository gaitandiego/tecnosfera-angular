import { Routes } from '@angular/router';

export const FAVORITES_ROUTES: Routes = [
  {
    path: '',
    title: 'Mis favoritos — Tecnosfera',
    loadComponent: () =>
      import('./pages/favorites-page/favorites-page.component').then(
        (module) => module.FavoritesPageComponent,
      ),
  },
];
