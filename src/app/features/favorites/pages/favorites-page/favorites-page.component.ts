import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { ArticleDatePipe } from '../../../../shared/pipes/article-date.pipe';
import { CategoryLabelPipe } from '../../../../shared/pipes/category-label.pipe';
import { ImagePlaceholderComponent } from '../../../../shared/components/image-placeholder/image-placeholder.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { FavoritesActions } from '../../store/favorites.actions';
import {
  selectFavoriteItems,
  selectFavoritesAreEmpty,
  selectFavoritesCount,
  selectFavoritesStatus,
} from '../../store/favorites.selectors';

// Noticias que el usuario guardó. Se pueden quitar una por una o vaciar
// toda la lista, pidiendo confirmación porque la acción no se puede deshacer.
@Component({
  selector: 'app-favorites-page',
  imports: [
    RouterLink,
    UpperCasePipe,
    ArticleDatePipe,
    CategoryLabelPipe,
    ImagePlaceholderComponent,
  ],
  templateUrl: './favorites-page.component.html',
  styleUrl: './favorites-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesPageComponent {
  private readonly store = inject(Store);
  private readonly toast = inject(ToastService);

  protected readonly items = this.store.selectSignal(selectFavoriteItems);
  protected readonly count = this.store.selectSignal(selectFavoritesCount);
  protected readonly isEmpty = this.store.selectSignal(selectFavoritesAreEmpty);
  protected readonly status = this.store.selectSignal(selectFavoritesStatus);

  protected remove(articleId: string): void {
    this.store.dispatch(FavoritesActions.remove({ articleId }));
    this.toast.show('Noticia retirada de favoritos');
  }

  protected clear(): void {
    if (!window.confirm('¿Deseas vaciar toda la lista de favoritos?')) {
      return;
    }

    this.store.dispatch(FavoritesActions.clear());
    this.toast.show('Lista de favoritos vaciada');
  }
}
