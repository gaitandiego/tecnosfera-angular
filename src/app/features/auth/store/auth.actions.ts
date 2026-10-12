import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Credentials, User } from '../../../core/models/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Restore Session': emptyProps(),
    'Restore Session Success': props<{ user: User | null }>(),
    Login: props<{ credentials: Credentials }>(),
    'Login Success': props<{ user: User }>(),
    'Login Failure': props<{ error: string }>(),
    Logout: emptyProps(),
    'Clear Error': emptyProps(),
  },
});
