import { createReducer, on } from '@ngrx/store';

import { ContactStatus } from '../models/contact-message.model';
import { ContactActions } from './contact.actions';

export const CONTACT_FEATURE_KEY = 'contact';

export interface ContactState {
  readonly status: ContactStatus;
  readonly error: string | null;
}

export const initialContactState: ContactState = {
  status: 'idle',
  error: null,
};

export const contactReducer = createReducer(
  initialContactState,
  on(ContactActions.sendMessage, (): ContactState => ({ status: 'sending', error: null })),
  on(ContactActions.sendMessageSuccess, (): ContactState => ({
    status: 'sent',
    error: null,
  })),
  on(ContactActions.sendMessageFailure, (_state, { error }): ContactState => ({
    status: 'error',
    error,
  })),
  on(ContactActions.reset, (): ContactState => initialContactState),
);
