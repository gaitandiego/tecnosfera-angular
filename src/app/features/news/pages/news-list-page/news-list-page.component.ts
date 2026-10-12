import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { CategoryFilter } from '../../../../core/models/category.model';
import { ArticleCardComponent } from '../../../../shared/components/article-card/article-card.component';
import { CategoryChipsComponent } from '../../components/category-chips/category-chips.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';
import { NewsActions } from '../../store/news.actions';
import {
  selectCurrentPage,
  selectFilteredCount,
  selectHasNextPage,
  selectHasPreviousPage,
  selectIsLoadingNews,
  selectNewsError,
  selectNoResults,
  selectPageNumbers,
  selectPagedArticles,
  selectSearchTerm,
  selectSelectedCategory,
} from '../../store/news.selectors';

@Component({
  selector: 'app-news-list-page',
  imports: [
    ArticleCardComponent,
    CategoryChipsComponent,
    SearchBoxComponent,
    PaginationComponent,
  ],
  templateUrl: './news-list-page.component.html',
  styleUrl: './news-list-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsListPageComponent implements OnInit {
  private readonly store = inject(Store);

  protected readonly articles = this.store.selectSignal(selectPagedArticles);
  protected readonly total = this.store.selectSignal(selectFilteredCount);
  protected readonly category = this.store.selectSignal(selectSelectedCategory);
  protected readonly search = this.store.selectSignal(selectSearchTerm);
  protected readonly page = this.store.selectSignal(selectCurrentPage);
  protected readonly pages = this.store.selectSignal(selectPageNumbers);
  protected readonly hasPrevious = this.store.selectSignal(selectHasPreviousPage);
  protected readonly hasNext = this.store.selectSignal(selectHasNextPage);
  protected readonly isLoading = this.store.selectSignal(selectIsLoadingNews);
  protected readonly noResults = this.store.selectSignal(selectNoResults);
  protected readonly error = this.store.selectSignal(selectNewsError);

  ngOnInit(): void {
    this.store.dispatch(NewsActions.loadArticles());
  }

  protected onCategoryChange(category: CategoryFilter): void {
    this.store.dispatch(NewsActions.changeCategory({ category }));
  }

  protected onSearchChange(search: string): void {
    this.store.dispatch(NewsActions.changeSearch({ search }));
  }

  protected onPageChange(page: number): void {
    this.store.dispatch(NewsActions.changePage({ page }));
  }

  protected clearFilters(): void {
    this.store.dispatch(NewsActions.clearFilters());
  }
}
