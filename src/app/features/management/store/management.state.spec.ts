import { Article } from '../../../core/models/article.model';
import { ManagementActions } from './management.actions';
import {
  ManagementState,
  initialManagementState,
  managementReducer,
} from './management.state';

describe('managementReducer', () => {
  const article = { id: '1', title: 'Noticia', category: 'networks' } as Article;
  const other = { id: '2', title: 'Otra', category: 'ai' } as Article;
  const draft = {
    title: 'Nueva',
    category: 'networks' as const,
    image: null,
    summary: 'Resumen',
    content: 'Contenido',
    author: 'admin@tecnosfera.co',
  };

  it('returns the initial state for an unknown action', () => {
    expect(managementReducer(undefined, { type: 'unknown' })).toEqual(
      initialManagementState,
    );
  });

  it('stores the loaded articles', () => {
    const state = managementReducer(
      initialManagementState,
      ManagementActions.loadArticlesSuccess({ articles: [article] }),
    );

    expect(state.articles).toEqual([article]);
    expect(state.status).toBe('loaded');
  });

  it('marks the slice as creating and clears the previous notice', () => {
    const state = managementReducer(
      { ...initialManagementState, notice: 'anterior' },
      ManagementActions.createArticle({ draft }),
    );

    expect(state.operation).toBe('creating');
    expect(state.notice).toBeNull();
  });

  it('puts the created article at the top and shows the confirmation', () => {
    const state = managementReducer(
      { ...initialManagementState, articles: [article] },
      ManagementActions.createArticleSuccess({ article: other }),
    );

    expect(state.articles.map((current) => current.id)).toEqual(['2', '1']);
    expect(state.notice).toBe('Noticia creada correctamente');
    expect(state.operation).toBe('done');
  });

  it('stores the pending deletion', () => {
    const state = managementReducer(
      initialManagementState,
      ManagementActions.askDeleteConfirmation({
        pending: { id: '1', title: 'Noticia' },
      }),
    );

    expect(state.pendingDeletion).toEqual({ id: '1', title: 'Noticia' });
  });

  it('drops the pending deletion when the reader cancels', () => {
    const previous: ManagementState = {
      ...initialManagementState,
      pendingDeletion: { id: '1', title: 'Noticia' },
    };

    expect(managementReducer(previous, ManagementActions.cancelDelete()).pendingDeletion)
      .toBeNull();
  });

  it('removes the deleted article and confirms the operation', () => {
    const previous: ManagementState = {
      ...initialManagementState,
      articles: [article, other],
      pendingDeletion: { id: '1', title: 'Noticia' },
      operation: 'deleting',
    };

    const state = managementReducer(
      previous,
      ManagementActions.deleteArticleSuccess({ id: '1' }),
    );

    expect(state.articles.map((current) => current.id)).toEqual(['2']);
    expect(state.pendingDeletion).toBeNull();
    expect(state.notice).toBe('Noticia eliminada');
  });

  it('keeps the list untouched when the deletion fails', () => {
    const previous: ManagementState = {
      ...initialManagementState,
      articles: [article],
      pendingDeletion: { id: '1', title: 'Noticia' },
    };

    const state = managementReducer(
      previous,
      ManagementActions.deleteArticleFailure({ error: 'No pudimos eliminar la noticia.' }),
    );

    expect(state.articles).toEqual([article]);
    expect(state.error).toBe('No pudimos eliminar la noticia.');
    expect(state.pendingDeletion).toBeNull();
  });

  it('clears the notice and the error', () => {
    const previous: ManagementState = {
      ...initialManagementState,
      notice: 'Noticia creada correctamente',
      error: 'algo',
      operation: 'done',
    };

    const state = managementReducer(previous, ManagementActions.dismissNotice());

    expect(state.notice).toBeNull();
    expect(state.error).toBeNull();
    expect(state.operation).toBe('idle');
  });
});
