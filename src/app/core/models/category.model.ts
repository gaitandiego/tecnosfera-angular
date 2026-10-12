import { ArticleCategory } from './article.model';

// Valor del filtro que muestra todas las categorías.
export const ALL_CATEGORIES = 'all' as const;

export type CategoryFilter = ArticleCategory | typeof ALL_CATEGORIES;

// Nombre visible de cada categoría, igual que en data/news.json.
export const CATEGORY_LABELS: Readonly<Record<ArticleCategory, string>> = {
  technology: 'Tecnología',
  networks: 'Redes',
  security: 'Ciberseguridad',
  ai: 'IA',
};

export interface CategoryOption {
  readonly value: CategoryFilter;
  readonly label: string;
}

// Opciones de los chips del listado (incluye "Todas").
export const CATEGORY_FILTER_OPTIONS: readonly CategoryOption[] = [
  { value: ALL_CATEGORIES, label: 'Todas' },
  { value: 'technology', label: CATEGORY_LABELS.technology },
  { value: 'networks', label: CATEGORY_LABELS.networks },
  { value: 'security', label: CATEGORY_LABELS.security },
  { value: 'ai', label: CATEGORY_LABELS.ai },
];

// Opciones del select de gestión (sin "Todas").
export const CATEGORY_OPTIONS: readonly CategoryOption[] =
  CATEGORY_FILTER_OPTIONS.filter((option) => option.value !== ALL_CATEGORIES);
