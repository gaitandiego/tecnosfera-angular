import { Article } from '../../../core/models/article.model';
import {
  selectIsLoadingManagement,
  selectIsSaving,
  selectManagedArticlesCount,
  selectPendingDeletion,
} from './management.selectors';
import { ManagementState, initialManagementState } from './management.state';

describe('management selectors', () => {
  const article = { id: '1', title: 'Noticia' } as Article;

  const state = (management: ManagementState) => ({ management });

  it('counts the managed articles', () => {
    expect(
      selectManagedArticlesCount(state({ ...initialManagementState, articles: [article] })),
    ).toBe(1);
  });

  it('treats the idle status as loading', () => {
    expect(selectIsLoadingManagement.projector('idle')).toBeTrue();
    expect(selectIsLoadingManagement.projector('loaded')).toBeFalse();
  });

  it('reports an in-flight create or delete', () => {
    expect(selectIsSaving(state({ ...initialManagementState, operation: 'creating' }))).toBeTrue();
    expect(selectIsSaving(state({ ...initialManagementState, operation: 'deleting' }))).toBeTrue();
    expect(selectIsSaving(state({ ...initialManagementState, operation: 'idle' }))).toBeFalse();
  });

  it('selects the pending deletion', () => {
    const pending = { id: '1', title: 'Noticia' };

    expect(
      selectPendingDeletion(state({ ...initialManagementState, pendingDeletion: pending })),
    ).toEqual(pending);
  });
});
