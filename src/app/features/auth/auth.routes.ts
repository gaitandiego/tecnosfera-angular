import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    title: 'Iniciar sesión — Tecnosfera',
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then(
        (module) => module.LoginPageComponent,
      ),
  },
];
