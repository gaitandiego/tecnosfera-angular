import { Injectable, inject } from '@angular/core';
import { Observable, defer, delay, of } from 'rxjs';

import { ContactMessage } from '../../features/contact/models/contact-message.model';
import { StorageService } from './storage.service';

const LATENCY_MS = 200;

// Los mensajes se guardan en el navegador porque el proyecto no tiene servidor.
export const MESSAGES_STORAGE_KEY = 'tecnosfera:messages';

@Injectable({ providedIn: 'root' })
export class ContactApiService {
  private readonly storage = inject(StorageService);

  send(message: ContactMessage): Observable<void> {
    return defer(() => {
      const messages = this.storage.read<unknown[]>(MESSAGES_STORAGE_KEY, []);

      this.storage.write(MESSAGES_STORAGE_KEY, [
        { ...message, date: new Date().toISOString() },
        ...messages,
      ]);

      return of(void 0);
    }).pipe(delay(LATENCY_MS));
  }
}
