import { Injectable } from '@angular/core';
import { Observable, defer, delay, of, throwError } from 'rxjs';

import { Credentials, User } from '../models/user.model';

const LATENCY_MS = 150;

// Usuario de prueba del proyecto, igual que en el prototipo HTML.
const KNOWN_ACCOUNT = {
  username: 'admin@tecnosfera.co',
  password: 'admin123',
} as const;

export const INVALID_CREDENTIALS_MESSAGE = 'Usuario o contraseña incorrectos';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  // Valida las credenciales con un retardo pequeño para simular el servidor.
  login(credentials: Credentials): Observable<User> {
    const matches =
      credentials.username.trim().toLowerCase() === KNOWN_ACCOUNT.username &&
      credentials.password === KNOWN_ACCOUNT.password;

    if (!matches) {
      return throwError(() => new Error(INVALID_CREDENTIALS_MESSAGE)).pipe(
        delay(LATENCY_MS),
      );
    }

    const user: User = {
      email: KNOWN_ACCOUNT.username,
      displayName: 'Administrador',
      role: 'admin',
    };

    return defer(() => of(user)).pipe(delay(LATENCY_MS));
  }
}
