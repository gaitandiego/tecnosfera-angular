import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { Article } from '../../../core/models/article.model';
import { FavoritesActions } from '../../../features/favorites/store/favorites.actions';
import { selectFavoriteEntries } from '../../../features/favorites/store/favorites.selectors';
import { CategoryLabelPipe } from '../../pipes/category-label.pipe';
import { ToastService } from '../../services/toast.service';
import { ImagePlaceholderComponent } from '../image-placeholder/image-placeholder.component';

// Tarjeta de noticia reutilizada en el inicio y en el listado. Incluye el
// botón de corazón para guardar o retirar la noticia de favoritos.
@Component({
  selector: 'app-article-card',
  imports: [RouterLink, UpperCasePipe, CategoryLabelPipe, ImagePlaceholderComponent],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleCardComponent {
  private readonly store = inject(Store);
  private readonly toast = inject(ToastService);

  readonly article = input.required<Article>();

  private readonly entries = this.store.selectSignal(selectFavoriteEntries);

  protected isFavorite(): boolean {
    return this.entries().some((entry) => entry.articleId === this.article().id);
  }

  protected toggleFavorite(): void {
    const wasSaved = this.isFavorite();

    this.store.dispatch(FavoritesActions.toggle({ articleId: this.article().id }));
    this.toast.show(
      wasSaved ? 'Noticia retirada de favoritos' : 'Noticia guardada en favoritos',
    );
  }
}
