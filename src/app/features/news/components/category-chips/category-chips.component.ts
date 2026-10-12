import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import {
  CATEGORY_FILTER_OPTIONS,
  CategoryFilter,
} from '../../../../core/models/category.model';

@Component({
  selector: 'app-category-chips',
  templateUrl: './category-chips.component.html',
  styleUrl: './category-chips.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryChipsComponent {
  readonly selected = input.required<CategoryFilter>();
  readonly categoryChange = output<CategoryFilter>();

  protected readonly options = CATEGORY_FILTER_OPTIONS;
}
