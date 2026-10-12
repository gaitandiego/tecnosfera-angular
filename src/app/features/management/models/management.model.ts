import { ArticleDraft } from '../../../core/models/article.model';

export type ManagementStatus = 'idle' | 'loading' | 'loaded' | 'error';

export type ManagementOperation = 'idle' | 'creating' | 'deleting' | 'done' | 'error';

// Noticia pendiente de confirmar su eliminación.
export interface PendingDeletion {
  readonly id: string;
  readonly title: string;
}

// El formulario no conoce la sesión: el autor lo agrega la pantalla con el
// usuario que está conectado.
export type ArticleFormValue = Omit<ArticleDraft, 'author'>;
