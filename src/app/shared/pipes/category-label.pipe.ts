import { Pipe, PipeTransform } from '@angular/core';

import { ArticleCategory } from '../../core/models/article.model';
import { CATEGORY_LABELS } from '../../core/models/category.model';

// Devuelve el nombre visible de la categoría (networks -> Redes).
@Pipe({ name: 'categoryLabel' })
export class CategoryLabelPipe implements PipeTransform {
  transform(category: ArticleCategory): string {
    return CATEGORY_LABELS[category] ?? category;
  }
}
