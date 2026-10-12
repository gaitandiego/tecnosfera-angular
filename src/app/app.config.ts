import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localeEsCo from '@angular/common/locales/es-CO';
import {
  ApplicationConfig,
  LOCALE_ID,
  inject,
  isDevMode,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { Store, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { APP_ROUTES } from './app.routes';
import { AuthActions } from './features/auth/store/auth.actions';
import { AuthEffects } from './features/auth/store/auth.effects';
import { AUTH_FEATURE_KEY, authReducer } from './features/auth/store/auth.state';
import { FavoritesActions } from './features/favorites/store/favorites.actions';
import { FavoritesEffects } from './features/favorites/store/favorites.effects';
import {
  FAVORITES_FEATURE_KEY,
  favoritesReducer,
} from './features/favorites/store/favorites.state';

registerLocaleData(localeEsCo);

// Providers de la raíz: router, HttpClient, store con los slices globales
// (auth y favoritos) y el idioma es-CO para fechas y números.
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es-CO' },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(
      APP_ROUTES,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
    provideStore({
      [AUTH_FEATURE_KEY]: authReducer,
      [FAVORITES_FEATURE_KEY]: favoritesReducer,
    }),
    provideEffects([AuthEffects, FavoritesEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), connectInZone: true }),
    provideAppInitializer(() => {
      const store = inject(Store);
      store.dispatch(AuthActions.restoreSession());
      store.dispatch(FavoritesActions.load());
    }),
  ],
};
