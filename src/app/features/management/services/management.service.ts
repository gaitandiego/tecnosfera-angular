import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Article, ArticleDraft } from '../../../core/models/article.model';
import { NewsApiService } from '../../../core/services/news-api.service';

@Injectable({ providedIn: 'root' })
export class ManagementService {
  private readonly api = inject(NewsApiService);

  list(): Observable<Article[]> {
    return this.api.getAll();
  }

  create(draft: ArticleDraft): Observable<Article> {
    return this.api.create(draft);
  }

  remove(id: string): Observable<string> {
    return this.api.remove(id);
  }
}
