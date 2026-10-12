import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';

import { ContactMessage } from '../models/contact-message.model';
import { ContactService } from '../services/contact.service';
import { ContactActions } from './contact.actions';
import { ContactEffects } from './contact.effects';

describe('ContactEffects', () => {
  let actions$: Observable<unknown>;
  let effects: ContactEffects;
  let contactService: jasmine.SpyObj<ContactService>;

  const message: ContactMessage = {
    fullName: 'Diego Gaitán',
    email: 'diego@conectarjdp.com',
    subject: 'inquiry',
    body: 'Una consulta general sobre el portal.',
    acceptsDataPolicy: true,
  };

  beforeEach(() => {
    contactService = jasmine.createSpyObj<ContactService>('ContactService', ['send']);

    TestBed.configureTestingModule({
      providers: [
        ContactEffects,
        provideMockActions(() => actions$),
        { provide: ContactService, useValue: contactService },
      ],
    });

    effects = TestBed.inject(ContactEffects);
  });

  it('maps a delivered message to sendMessageSuccess', (done) => {
    contactService.send.and.returnValue(of(void 0));
    actions$ = of(ContactActions.sendMessage({ message }));

    effects.sendMessage$.subscribe((action) => {
      expect(contactService.send).toHaveBeenCalledWith(message);
      expect(action).toEqual(ContactActions.sendMessageSuccess());
      done();
    });
  });

  it('maps a rejected delivery to sendMessageFailure', (done) => {
    contactService.send.and.returnValue(throwError(() => new Error('boom')));
    actions$ = of(ContactActions.sendMessage({ message }));

    effects.sendMessage$.subscribe((action) => {
      expect(action.type).toBe(ContactActions.sendMessageFailure.type);
      done();
    });
  });
});
