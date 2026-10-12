import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ContactMessage } from '../models/contact-message.model';

export const ContactActions = createActionGroup({
  source: 'Contact',
  events: {
    'Send Message': props<{ message: ContactMessage }>(),
    'Send Message Success': emptyProps(),
    'Send Message Failure': props<{ error: string }>(),
    Reset: emptyProps(),
  },
});
