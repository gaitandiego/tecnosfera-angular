import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { Article } from '../../../../core/models/article.model';
import { CategoryLabelPipe } from '../../../../shared/pipes/category-label.pipe';
import { selectCurrentUser } from '../../../auth/store/auth.selectors';
import { ArticleFormComponent } from '../../components/article-form/article-form.component';
import { ArticleFormValue } from '../../models/management.model';
import { ManagementActions } from '../../store/management.actions';
import {
  selectIsLoadingManagement,
  selectIsSaving,
  selectManagedArticles,
  selectManagementError,
  selectManagementNotice,
  selectPendingDeletion,
} from '../../store/management.selectors';

// Gestión de noticias: tabla con lo publicado, confirmación antes de
// eliminar y formulario para crear. Solo se llega aquí con sesión activa.
@Component({
  selector: 'app-management-page',
  imports: [CategoryLabelPipe, ArticleFormComponent],
  templateUrl: './management-page.component.html',
  styleUrl: './management-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementPageComponent implements OnInit {
  private readonly store = inject(Store);

  protected readonly articles = this.store.selectSignal(selectManagedArticles);
  protected readonly isLoading = this.store.selectSignal(selectIsLoadingManagement);
  protected readonly isSaving = this.store.selectSignal(selectIsSaving);
  protected readonly pendingDeletion = this.store.selectSignal(selectPendingDeletion);
  protected readonly notice = this.store.selectSignal(selectManagementNotice);
  protected readonly error = this.store.selectSignal(selectManagementError);
  protected readonly user = this.store.selectSignal(selectCurrentUser);

  ngOnInit(): void {
    this.store.dispatch(ManagementActions.loadArticles());
  }

  // El autor de la noticia es el usuario de la sesión.
  protected create(value: ArticleFormValue): void {
    this.store.dispatch(
      ManagementActions.createArticle({
        draft: { ...value, author: this.user()?.email ?? 'Redacción Tecnosfera' },
      }),
    );
  }

  protected askDelete(article: Article): void {
    this.store.dispatch(
      ManagementActions.askDeleteConfirmation({
        pending: { id: article.id, title: article.title },
      }),
    );
  }

  protected cancelDelete(): void {
    this.store.dispatch(ManagementActions.cancelDelete());
  }

  protected confirmDelete(): void {
    this.store.dispatch(ManagementActions.confirmDelete());
  }

  protected dismissNotice(): void {
    this.store.dispatch(ManagementActions.dismissNotice());
  }
}
