import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { ArticleDatePipe } from '../../../../shared/pipes/article-date.pipe';
import { CategoryLabelPipe } from '../../../../shared/pipes/category-label.pipe';
import { ImagePlaceholderComponent } from '../../../../shared/components/image-placeholder/image-placeholder.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { FavoritesActions } from '../../../favorites/store/favorites.actions';
import { selectFavoriteEntries } from '../../../favorites/store/favorites.selectors';
import { NewsActions } from '../../store/news.actions';
import {
  selectDetailError,
  selectDetailStatus,
  selectSelectedArticle,
} from '../../store/news.selectors';

// Detalle de la noticia. El id llega por la URL (/noticias/2) y se usa para
// pedir la noticia al store, marcarla como favorita y copiar su enlace.
@Component({
  selector: 'app-news-detail-page',
  imports: [
    RouterLink,
    UpperCasePipe,
    ArticleDatePipe,
    CategoryLabelPipe,
    ImagePlaceholderComponent,
  ],
  templateUrl: './news-detail-page.component.html',
  styleUrl: './news-detail-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsDetailPageComponent {
  private readonly store = inject(Store);
  private readonly toast = inject(ToastService);

  readonly id = input.required<string>();

  protected readonly article = this.store.selectSignal(selectSelectedArticle);
  protected readonly status = this.store.selectSignal(selectDetailStatus);
  protected readonly error = this.store.selectSignal(selectDetailError);

  private readonly favoriteEntries = this.store.selectSignal(selectFavoriteEntries);

  constructor() {
    // Cada vez que cambia el id de la URL se vuelve a pedir la noticia.
    effect(() => {
      this.store.dispatch(NewsActions.loadArticle({ id: this.id() }));
    });
  }

  protected isFavorite(): boolean {
    return this.favoriteEntries().some((entry) => entry.articleId === this.id());
  }

  protected toggleFavorite(): void {
    const wasSaved = this.isFavorite();

    this.store.dispatch(FavoritesActions.toggle({ articleId: this.id() }));
    this.toast.show(
      wasSaved ? 'Noticia retirada de favoritos' : 'Noticia guardada en favoritos',
    );
  }

  // Copia el enlace de la noticia para poder compartirlo.
  protected share(): void {
    void navigator.clipboard?.writeText(window.location.href);
    this.toast.show('Enlace copiado al portapapeles');
  }
}
