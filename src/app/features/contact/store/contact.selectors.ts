import { createFeatureSelector, createSelector } from '@ngrx/store';

import { CONTACT_FEATURE_KEY, ContactState } from './contact.state';

const selectContactState = createFeatureSelector<ContactState>(CONTACT_FEATURE_KEY);

export const selectContactStatus = createSelector(
  selectContactState,
  (state) => state.status,
);

export const selectContactError = createSelector(
  selectContactState,
  (state) => state.error,
);

export const selectIsSendingMessage = createSelector(
  selectContactStatus,
  (status) => status === 'sending',
);

export const selectMessageWasSent = createSelector(
  selectContactStatus,
  (status) => status === 'sent',
);
