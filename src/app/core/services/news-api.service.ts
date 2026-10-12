import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay, switchMap, throwError } from 'rxjs';

import { Article, ArticleDraft, ArticleCategory } from '../models/article.model';
import { StorageService } from './storage.service';

// Archivo con las noticias base; se sirve desde la carpeta public.
export const NEWS_URL = 'data/news.json';

// Claves del almacenamiento del navegador, con el mismo prefijo del prototipo.
export const CREATED_STORAGE_KEY = 'tecnosfera:created';
export const REMOVED_STORAGE_KEY = 'tecnosfera:removed';

// Las noticias creadas desde gestión usan ids desde 1001 para no chocar con el JSON.
const FIRST_CREATED_ID = 1001;

interface NewsFile {
  readonly categories: readonly { value: ArticleCategory; label: string }[];
  readonly articles: readonly Article[];
}

@Injectable({ providedIn: 'root' })
export class NewsApiService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);

  // El JSON se descarga una sola vez y se comparte entre todas las pantallas.
  private readonly file$ = this.http
    .get<NewsFile>(NEWS_URL)
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  // Las creadas van primero y las eliminadas se descartan.
  getAll(): Observable<Article[]> {
    return this.file$.pipe(
      map((file) => {
        const created = this.readCreated();
        const removed = this.readRemoved();

        return [...created, ...file.articles]
          .map((article) => ({ ...article, id: String(article.id) }))
          .filter((article) => !removed.includes(article.id));
      }),
    );
  }

  // Noticia de portada: la marcada con cover y, si no hay, la primera.
  getCover(): Observable<Article | null> {
    return this.getAll().pipe(
      map((articles) => articles.find((article) => article.cover) ?? articles[0] ?? null),
    );
  }

  getFeatured(): Observable<Article[]> {
    return this.getAll().pipe(map((articles) => articles.filter((article) => article.featured)));
  }

  getById(id: string): Observable<Article> {
    return this.getAll().pipe(
      switchMap((articles) => {
        const article = articles.find((candidate) => candidate.id === id);

        return article
          ? [article]
          : throwError(() => new Error('La noticia solicitada no existe o fue eliminada.'));
      }),
    );
  }

  getByIds(ids: readonly string[]): Observable<Article[]> {
    return this.getAll().pipe(
      map((articles) =>
        ids
          .map((id) => articles.find((article) => article.id === id))
          .filter((article): article is Article => article !== undefined),
      ),
    );
  }

  // Guarda la noticia nueva en el navegador y la devuelve ya armada.
  create(draft: ArticleDraft): Observable<Article> {
    return this.getAll().pipe(
      map(() => {
        const created = this.readCreated();

        const article: Article = {
          id: String(this.nextId(created)),
          title: draft.title.trim(),
          category: draft.category,
          date: this.today(),
          author: draft.author,
          readingTime: this.estimateReadingTime(draft.content),
          image: draft.image?.trim() ? draft.image.trim() : null,
          caption: '',
          summary: draft.summary.trim(),
          cover: false,
          featured: false,
          content: [{ type: 'p', text: draft.content.trim() }],
        };

        this.storage.write(CREATED_STORAGE_KEY, [article, ...created]);

        return article;
      }),
    );
  }

  // Si la noticia fue creada en gestión se borra de la lista; si viene del JSON
  // se guarda su id como eliminada, porque el archivo es de solo lectura.
  remove(id: string): Observable<string> {
    return this.getAll().pipe(
      map(() => {
        const created = this.readCreated();

        if (created.some((article) => article.id === id)) {
          this.storage.write(
            CREATED_STORAGE_KEY,
            created.filter((article) => article.id !== id),
          );
        } else {
          const removed = this.readRemoved();

          if (!removed.includes(id)) {
            this.storage.write(REMOVED_STORAGE_KEY, [...removed, id]);
          }
        }

        return id;
      }),
    );
  }

  // Devuelve el portal al estado inicial del JSON.
  reset(): void {
    this.storage.remove(CREATED_STORAGE_KEY);
    this.storage.remove(REMOVED_STORAGE_KEY);
  }

  private readCreated(): Article[] {
    return this.storage
      .read<Article[]>(CREATED_STORAGE_KEY, [])
      .map((article) => ({ ...article, id: String(article.id) }));
  }

  private readRemoved(): string[] {
    return this.storage.read<(string | number)[]>(REMOVED_STORAGE_KEY, []).map(String);
  }

  private nextId(created: readonly Article[]): number {
    return created.reduce((highest, article) => {
      const numeric = Number.parseInt(article.id, 10);
      return Number.isNaN(numeric) ? highest : Math.max(highest, numeric + 1);
    }, FIRST_CREATED_ID);
  }

  // Fecha de hoy en el mismo formato del JSON.
  private today(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${now.getFullYear()}-${month}-${day}`;
  }

  private estimateReadingTime(content: string): number {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }
}
