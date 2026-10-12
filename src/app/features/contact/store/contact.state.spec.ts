import { ContactMessage } from '../models/contact-message.model';
import { ContactActions } from './contact.actions';
import { contactReducer, initialContactState } from './contact.state';

describe('contactReducer', () => {
  const message: ContactMessage = {
    fullName: 'Diego Gaitán',
    email: 'diego@conectarjdp.com',
    subject: 'proposal',
    body: 'Tengo una propuesta de noticia sobre fibra óptica.',
    acceptsDataPolicy: true,
  };

  it('returns the initial state for an unknown action', () => {
    expect(contactReducer(undefined, { type: 'unknown' })).toEqual(initialContactState);
  });

  it('marks the form as sending', () => {
    const state = contactReducer(
      { status: 'error', error: 'previo' },
      ContactActions.sendMessage({ message }),
    );

    expect(state.status).toBe('sending');
    expect(state.error).toBeNull();
  });

  it('marks the message as sent', () => {
    const state = contactReducer(
      { status: 'sending', error: null },
      ContactActions.sendMessageSuccess(),
    );

    expect(state.status).toBe('sent');
  });

  it('stores the error message', () => {
    const state = contactReducer(
      { status: 'sending', error: null },
      ContactActions.sendMessageFailure({ error: 'No pudimos enviar tu mensaje.' }),
    );

    expect(state.status).toBe('error');
    expect(state.error).toBe('No pudimos enviar tu mensaje.');
  });

  it('resets the slice when leaving the screen', () => {
    expect(contactReducer({ status: 'sent', error: null }, ContactActions.reset())).toEqual(
      initialContactState,
    );
  });
});
