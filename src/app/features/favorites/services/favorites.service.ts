import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';

import { NewsApiService } from '../../../core/services/news-api.service';
import { StorageService } from '../../../core/services/storage.service';
import { FavoriteEntry, FavoriteItem } from '../models/favorite.model';

export const FAVORITES_STORAGE_KEY = 'tecnosfera:favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly storage = inject(StorageService);
  private readonly newsApi = inject(NewsApiService);

  loadEntries(): Observable<FavoriteEntry[]> {
    return of(this.storage.read<FavoriteEntry[]>(FAVORITES_STORAGE_KEY, []));
  }

  persist(entries: readonly FavoriteEntry[]): void {
    this.storage.write(FAVORITES_STORAGE_KEY, entries);
  }

  resolve(entries: readonly FavoriteEntry[]): Observable<FavoriteItem[]> {
    if (entries.length === 0) {
      return of([]);
    }

    const ids = entries.map((entry) => entry.articleId);

    return this.newsApi.getByIds(ids).pipe(
      map((articles) =>
        articles
          .map((article) => ({
            article,
            savedAt:
              entries.find((entry) => entry.articleId === article.id)?.savedAt ??
              new Date().toISOString(),
          }))
          .sort((a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt)),
      ),
    );
  }
}
