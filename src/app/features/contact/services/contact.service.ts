import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ContactApiService } from '../../../core/services/contact-api.service';
import { ContactMessage } from '../models/contact-message.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly api = inject(ContactApiService);

  send(message: ContactMessage): Observable<void> {
    return this.api.send(message);
  }
}
