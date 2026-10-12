import {
  selectContactError,
  selectIsSendingMessage,
  selectMessageWasSent,
} from './contact.selectors';
import { ContactState } from './contact.state';

describe('contact selectors', () => {
  const state = (contact: ContactState) => ({ contact });

  it('reports an in-flight submission', () => {
    expect(selectIsSendingMessage(state({ status: 'sending', error: null }))).toBeTrue();
    expect(selectIsSendingMessage(state({ status: 'idle', error: null }))).toBeFalse();
  });

  it('reports a delivered message', () => {
    expect(selectMessageWasSent(state({ status: 'sent', error: null }))).toBeTrue();
  });

  it('selects the error message', () => {
    expect(selectContactError(state({ status: 'error', error: 'Falló' }))).toBe('Falló');
  });
});
