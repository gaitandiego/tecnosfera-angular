import { User } from '../../../core/models/user.model';

export type AuthStatus = 'idle' | 'authenticating' | 'authenticated' | 'error';

export interface AuthSession {
  readonly user: User;

  readonly openedAt: string;
}
