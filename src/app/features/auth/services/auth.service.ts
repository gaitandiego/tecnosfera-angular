import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { AuthApiService } from '../../../core/services/auth-api.service';
import { StorageService } from '../../../core/services/storage.service';
import { Credentials, User } from '../../../core/models/user.model';
import { AuthSession } from '../models/auth.model';

export const AUTH_SESSION_STORAGE_KEY = 'tecnosfera:session';

// Inicio y cierre de sesión. Si el usuario marca "Recordarme" la sesión se
// guarda en el navegador para restaurarla al volver a abrir la aplicación.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(AuthApiService);
  private readonly storage = inject(StorageService);

  login(credentials: Credentials): Observable<User> {
    return this.api.login(credentials).pipe(
      tap((user) => {
        if (credentials.rememberMe) {
          const session: AuthSession = { user, openedAt: new Date().toISOString() };
          this.storage.write(AUTH_SESSION_STORAGE_KEY, session);
        }
      }),
    );
  }

  logout(): void {
    this.storage.remove(AUTH_SESSION_STORAGE_KEY);
  }

  restoreSession(): Observable<User | null> {
    return new Observable<AuthSession | null>((subscriber) => {
      subscriber.next(this.storage.read<AuthSession | null>(AUTH_SESSION_STORAGE_KEY, null));
      subscriber.complete();
    }).pipe(map((session) => session?.user ?? null));
  }
}
