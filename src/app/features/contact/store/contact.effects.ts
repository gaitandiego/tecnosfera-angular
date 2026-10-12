import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { ContactService } from '../services/contact.service';
import { ContactActions } from './contact.actions';

@Injectable()
export class ContactEffects {
  private readonly actions$ = inject(Actions);
  private readonly contactService = inject(ContactService);

  readonly sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContactActions.sendMessage),
      exhaustMap(({ message }) =>
        this.contactService.send(message).pipe(
          map(() => ContactActions.sendMessageSuccess()),
          catchError(() =>
            of(
              ContactActions.sendMessageFailure({
                error: 'No pudimos enviar tu mensaje. Intenta de nuevo.',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
