import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { ArticleCardComponent } from '../../../../shared/components/article-card/article-card.component';
import { ImagePlaceholderComponent } from '../../../../shared/components/image-placeholder/image-placeholder.component';
import { ArticleDatePipe } from '../../../../shared/pipes/article-date.pipe';
import { HomeActions } from '../../store/home.actions';
import {
  selectCoverArticle,
  selectHighlights,
  selectHomeError,
  selectIsLoadingHome,
} from '../../store/home.selectors';

// Portada del portal: noticia principal, destacadas y llamado a contacto.
@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink,
    ArticleDatePipe,
    ArticleCardComponent,
    ImagePlaceholderComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
  private readonly store = inject(Store);

  protected readonly cover = this.store.selectSignal(selectCoverArticle);
  protected readonly highlights = this.store.selectSignal(selectHighlights);
  protected readonly isLoading = this.store.selectSignal(selectIsLoadingHome);
  protected readonly error = this.store.selectSignal(selectHomeError);

  ngOnInit(): void {
    this.store.dispatch(HomeActions.loadContent());
  }
}
