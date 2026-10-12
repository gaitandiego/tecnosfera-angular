import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import { Article } from '../../../core/models/article.model';
import { NewsApiService } from '../../../core/services/news-api.service';
import { FavoriteEntry, FavoriteItem } from '../models/favorite.model';
import { FAVORITES_STORAGE_KEY, FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let api: jasmine.SpyObj<NewsApiService>;

  const entries: FavoriteEntry[] = [
    { articleId: '1', savedAt: '2026-09-09T00:00:00.000Z' },
    { articleId: '2', savedAt: '2026-09-11T00:00:00.000Z' },
  ];

  const article = (id: string): Article =>
    ({ id, title: `Noticia ${id}`, category: 'networks', date: '2026-09-11' }) as Article;

  beforeEach(() => {
    localStorage.clear();

    api = jasmine.createSpyObj<NewsApiService>('NewsApiService', ['getByIds']);
    api.getByIds.and.callFake((ids: readonly string[]) =>
      of(ids.filter((id) => id !== 'ghost').map(article)),
    );

    TestBed.configureTestingModule({
      providers: [{ provide: NewsApiService, useValue: api }],
    });

    service = TestBed.inject(FavoritesService);
  });

  afterEach(() => localStorage.clear());

  it('returns an empty list when nothing was persisted', (done) => {
    service.loadEntries().subscribe((result) => {
      expect(result).toEqual([]);
      done();
    });
  });

  it('persists and reads back the entries', (done) => {
    service.persist(entries);

    service.loadEntries().subscribe((result) => {
      expect(result).toEqual(entries);
      expect(localStorage.getItem(FAVORITES_STORAGE_KEY)).toBeTruthy();
      done();
    });
  });

  it('resolves an empty list without hitting the api', (done) => {
    service.resolve([]).subscribe((items) => {
      expect(items).toEqual([]);
      expect(api.getByIds).not.toHaveBeenCalled();
      done();
    });
  });

  it('resolves entries into items sorted by save date, newest first', fakeAsync(() => {
    let items: FavoriteItem[] = [];
    service.resolve(entries).subscribe((result) => (items = result));
    tick();

    expect(items.map((item) => item.article.id)).toEqual(['2', '1']);
    expect(items[0].savedAt).toBe('2026-09-11T00:00:00.000Z');
  }));

  it('drops entries whose article no longer exists', fakeAsync(() => {
    let items: FavoriteItem[] = [];

    service
      .resolve([{ articleId: 'ghost', savedAt: '2026-09-01T00:00:00.000Z' }, ...entries])
      .subscribe((result) => (items = result));
    tick();

    expect(items.map((item) => item.article.id)).toEqual(['2', '1']);
  }));
});
