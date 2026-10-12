import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { Article } from '../../../../core/models/article.model';
import { PendingDeletion } from '../../models/management.model';
import { selectCurrentUser } from '../../../auth/store/auth.selectors';
import { ManagementActions } from '../../store/management.actions';
import {
  selectIsLoadingManagement,
  selectIsSaving,
  selectManagedArticles,
  selectManagementError,
  selectManagementNotice,
  selectPendingDeletion,
} from '../../store/management.selectors';
import { ManagementPageComponent } from './management-page.component';

describe('ManagementPageComponent', () => {
  let fixture: ComponentFixture<ManagementPageComponent>;
  let store: MockStore;
  let dispatch: jasmine.Spy;
  let pending: MemoizedSelector<Record<string, unknown>, PendingDeletion | null>;
  let notice: MemoizedSelector<Record<string, unknown>, string | null>;

  const articles: Article[] = [
    { id: '1', title: 'IPv6 llega a los hogares', category: 'networks' } as Article,
    { id: '2', title: 'Modelos abiertos', category: 'ai' } as Article,
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementPageComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectManagedArticles, articles);
    store.overrideSelector(selectIsLoadingManagement, false);
    store.overrideSelector(selectIsSaving, false);
    pending = store.overrideSelector(selectPendingDeletion, null);
    notice = store.overrideSelector(selectManagementNotice, null);
    store.overrideSelector(selectManagementError, null);

    store.overrideSelector(selectCurrentUser, null);

    dispatch = spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ManagementPageComponent);
    fixture.detectChanges();
  });

  it('asks for the collection on init', () => {
    expect(dispatch).toHaveBeenCalledWith(ManagementActions.loadArticles());
  });

  it('renders one table row per article with its category label', () => {
    const rows: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('tbody tr'),
    );

    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('IPv6 llega a los hogares');
    expect(rows[0].textContent).toContain('Redes');
  });

  it('asks for confirmation before deleting', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'tbody tr .btn',
    );
    button.click();

    expect(dispatch).toHaveBeenCalledWith(
      ManagementActions.askDeleteConfirmation({
        pending: { id: '1', title: 'IPv6 llega a los hogares' },
      }),
    );
  });

  it('shows the confirmation box with the article title', () => {
    pending.setResult({ id: '1', title: 'IPv6 llega a los hogares' });
    store.refreshState();
    fixture.detectChanges();

    const box: HTMLElement = fixture.nativeElement.querySelector(
      '[data-testid="delete-confirmation"]',
    );

    expect(box.textContent).toContain('¿Eliminar "IPv6 llega a los hogares"?');
  });

  it('dispatches the confirmation and the cancellation', () => {
    pending.setResult({ id: '1', title: 'IPv6 llega a los hogares' });
    store.refreshState();
    fixture.detectChanges();

    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('[data-testid="delete-confirmation"] button'),
    );

    buttons[0].click();
    expect(dispatch).toHaveBeenCalledWith(ManagementActions.cancelDelete());

    buttons[1].click();
    expect(dispatch).toHaveBeenCalledWith(ManagementActions.confirmDelete());
  });

  it('shows the success notice', () => {
    notice.setResult('Noticia creada correctamente');
    store.refreshState();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('[data-testid="management-notice"]')?.textContent,
    ).toContain('Noticia creada correctamente');
  });

  it('dispatches the draft emitted by the form', () => {
    const form = fixture.debugElement.query(
      (node) => node.name === 'app-article-form',
    );

    form.componentInstance.save.emit({
      title: 'Nueva noticia',
      category: 'networks',
      image: null,
      summary: 'Resumen',
      content: 'Contenido',
    });

    expect(dispatch).toHaveBeenCalledWith(
      ManagementActions.createArticle({
        draft: {
          title: 'Nueva noticia',
          category: 'networks',
          image: null,
          summary: 'Resumen',
          content: 'Contenido',
          author: 'Redacción Tecnosfera',
        },
      }),
    );
  });

  afterEach(() => store.resetSelectors());

});
