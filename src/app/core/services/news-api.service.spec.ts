import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Article, ArticleDraft } from '../models/article.model';
import {
  CREATED_STORAGE_KEY,
  NEWS_URL,
  NewsApiService,
  REMOVED_STORAGE_KEY,
} from './news-api.service';

describe('NewsApiService', () => {
  let service: NewsApiService;
  let http: HttpTestingController;

  const draft: ArticleDraft = {
    title: '  Nueva noticia  ',
    category: 'networks',
    image: '  img/foto.svg ',
    summary: '  Resumen breve ',
    content: 'Cuerpo de la noticia con suficiente texto para estimar la lectura.',
    author: 'admin@tecnosfera.co',
  };

  // Archivo de noticias reducido, con la misma forma de data/news.json.
  const file = {
    categories: [
      { value: 'technology', label: 'Tecnología' },
      { value: 'networks', label: 'Redes' },
    ],
    articles: [
      {
        id: 1,
        title: 'Noticia de portada',
        category: 'technology',
        date: '2026-09-12',
        author: 'Redacción Tecnosfera',
        readingTime: 7,
        image: 'img/news-01.svg',
        caption: 'Pie de foto',
        summary: 'Resumen de la portada',
        cover: true,
        featured: false,
        content: [{ type: 'p', text: 'Cuerpo' }],
      },
      {
        id: 2,
        title: 'Noticia destacada',
        category: 'networks',
        date: '2026-09-11',
        author: 'Redacción Tecnosfera',
        readingTime: 6,
        image: 'img/news-02.svg',
        caption: '',
        summary: 'Resumen de la destacada',
        cover: false,
        featured: true,
        content: [{ type: 'p', text: 'Cuerpo' }],
      },
    ],
  };

  // Responde la única petición del JSON que hace el servicio.
  const flush = (): void => http.expectOne(NEWS_URL).flush(file);

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(NewsApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => localStorage.clear());

  it('devuelve las noticias del archivo con el id como texto', () => {
    let result: Article[] = [];
    service.getAll().subscribe((articles) => (result = articles));
    flush();

    expect(result.length).toBe(2);
    expect(result.map((article) => article.id)).toEqual(['1', '2']);
  });

  it('devuelve la noticia marcada como portada', () => {
    let cover: Article | null = null;
    service.getCover().subscribe((article) => (cover = article));
    flush();

    expect(cover!.id).toBe('1');
  });

  it('devuelve solo las noticias destacadas', () => {
    let result: Article[] = [];
    service.getFeatured().subscribe((articles) => (result = articles));
    flush();

    expect(result.map((article) => article.id)).toEqual(['2']);
  });

  it('busca una noticia por su id', () => {
    let result: Article | undefined;
    service.getById('2').subscribe((article) => (result = article));
    flush();

    expect(result?.title).toBe('Noticia destacada');
  });

  it('falla cuando el id no existe', () => {
    let error: Error | undefined;
    service.getById('999').subscribe({ error: (err: Error) => (error = err) });
    flush();

    expect(error?.message).toContain('no existe');
  });

  it('resuelve una lista de ids y descarta los desconocidos', () => {
    let result: Article[] = [];
    service.getByIds(['2', 'nope', '1']).subscribe((articles) => (result = articles));
    flush();

    expect(result.map((article) => article.id)).toEqual(['2', '1']);
  });

  it('crea la noticia, recorta los campos y la guarda en el navegador', () => {
    let created: Article | undefined;
    service.create(draft).subscribe((article) => (created = article));
    flush();

    expect(created?.id).toBe('1001');
    expect(created?.title).toBe('Nueva noticia');
    expect(created?.summary).toBe('Resumen breve');
    expect(created?.image).toBe('img/foto.svg');
    expect(created?.author).toBe('admin@tecnosfera.co');
    expect(created?.featured).toBeFalse();
    expect(created?.content.length).toBe(1);

    const stored = JSON.parse(
      localStorage.getItem(CREATED_STORAGE_KEY) ?? '[]',
    ) as Article[];
    expect(stored[0].id).toBe('1001');
  });

  it('guarda el id de la noticia eliminada cuando viene del archivo', () => {
    service.remove('1').subscribe();
    flush();

    const removed = JSON.parse(
      localStorage.getItem(REMOVED_STORAGE_KEY) ?? '[]',
    ) as string[];
    expect(removed).toEqual(['1']);
  });

  it('descarta las noticias eliminadas al listar', () => {
    localStorage.setItem(REMOVED_STORAGE_KEY, JSON.stringify(['1']));

    let result: Article[] = [];
    service.getAll().subscribe((articles) => (result = articles));
    flush();

    expect(result.map((article) => article.id)).toEqual(['2']);
  });

  it('vuelve al estado inicial del archivo con reset', () => {
    localStorage.setItem(REMOVED_STORAGE_KEY, JSON.stringify(['1']));
    service.reset();

    let result: Article[] = [];
    service.getAll().subscribe((articles) => (result = articles));
    flush();

    expect(result.length).toBe(2);
  });
});
