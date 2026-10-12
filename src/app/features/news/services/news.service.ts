import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Article } from '../../../core/models/article.model';
import { NewsApiService } from '../../../core/services/news-api.service';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly api = inject(NewsApiService);

  getArticles(): Observable<Article[]> {
    return this.api.getAll();
  }

  getArticle(id: string): Observable<Article> {
    return this.api.getById(id);
  }
}
