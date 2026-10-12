import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { ContactEffects } from './store/contact.effects';
import { CONTACT_FEATURE_KEY, contactReducer } from './store/contact.state';

export const CONTACT_ROUTES: Routes = [
  {
    path: '',
    title: 'Contacto — Tecnosfera',
    providers: [
      provideState({ name: CONTACT_FEATURE_KEY, reducer: contactReducer }),
      provideEffects(ContactEffects),
    ],
    loadComponent: () =>
      import('./pages/contact-page/contact-page.component').then(
        (module) => module.ContactPageComponent,
      ),
  },
];
