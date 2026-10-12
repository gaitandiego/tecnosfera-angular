import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';

import { Article } from '../../../core/models/article.model';
import { NewsApiService } from '../../../core/services/news-api.service';
import { HomeContent } from '../models/home.model';
import { HomeService } from './home.service';

describe('HomeService', () => {
  let service: HomeService;
  let api: jasmine.SpyObj<NewsApiService>;

  const article = (id: string, cover: boolean, featured: boolean): Article =>
    ({
      id,
      title: `Noticia ${id}`,
      category: 'technology',
      date: '2026-09-12',
      cover,
      featured,
    }) as Article;

  const cover = article('1', true, true);
  const featured = [cover, article('2', false, true), article('3', false, true), article('4', false, true), article('5', false, true)];

  beforeEach(() => {
    api = jasmine.createSpyObj<NewsApiService>('NewsApiService', ['getCover', 'getFeatured']);
    api.getCover.and.returnValue(of(cover));
    api.getFeatured.and.returnValue(of(featured));

    TestBed.configureTestingModule({
      providers: [{ provide: NewsApiService, useValue: api }],
    });

    service = TestBed.inject(HomeService);
  });

  it('uses the article marked as cover', fakeAsync(() => {
    let content: HomeContent | undefined;
    service.getContent().subscribe((result) => (content = result));
    tick();

    expect(content?.cover?.id).toBe('1');
    expect(content?.cover?.cover).toBeTrue();
  }));

  it('returns at most three highlights and never repeats the cover', fakeAsync(() => {
    let content: HomeContent | undefined;
    service.getContent().subscribe((result) => (content = result));
    tick();

    expect(content?.highlights.length).toBe(3);
    expect(
      content?.highlights.some((item) => item.id === content?.cover?.id),
    ).toBeFalse();
  }));
});
