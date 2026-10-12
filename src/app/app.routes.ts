import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
  },
  {
    path: 'noticias',
    loadChildren: () => import('./features/news/news.routes').then((m) => m.NEWS_ROUTES),
  },
  {
    path: 'favoritos',
    loadChildren: () =>
      import('./features/favorites/favorites.routes').then((m) => m.FAVORITES_ROUTES),
  },
  {
    path: 'contacto',
    loadChildren: () =>
      import('./features/contact/contact.routes').then((m) => m.CONTACT_ROUTES),
  },
  {
    path: 'ingresar',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'gestion',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/management/management.routes').then((m) => m.MANAGEMENT_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
