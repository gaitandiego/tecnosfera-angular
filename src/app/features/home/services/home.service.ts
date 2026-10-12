import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';

import { NewsApiService } from '../../../core/services/news-api.service';
import { HOME_HIGHLIGHTS_LIMIT, HomeContent } from '../models/home.model';

// Contenido del inicio: la noticia de portada (cover) y las destacadas
// (featured), sin repetir la de portada.
@Injectable({ providedIn: 'root' })
export class HomeService {
  private readonly api = inject(NewsApiService);

  getContent(): Observable<HomeContent> {
    return combineLatest([this.api.getCover(), this.api.getFeatured()]).pipe(
      map(([cover, featured]) => ({
        cover,
        highlights: featured
          .filter((article) => article.id !== cover?.id)
          .slice(0, HOME_HIGHLIGHTS_LIMIT),
      })),
    );
  }
}
