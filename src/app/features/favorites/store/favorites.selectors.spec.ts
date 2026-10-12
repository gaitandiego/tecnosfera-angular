import { Article } from '../../../core/models/article.model';
import { FavoriteEntry } from '../models/favorite.model';
import {
  selectFavoriteItems,
  selectFavoritesAreEmpty,
  selectFavoritesCount,
  selectIsFavorite,
} from './favorites.selectors';
import { FavoritesState, initialFavoritesState } from './favorites.state';

describe('favorites selectors', () => {
  const article = { id: '1', title: 'Noticia' } as Article;
  const entries: FavoriteEntry[] = [
    { articleId: '1', savedAt: '2026-09-10T00:00:00.000Z' },
    { articleId: '4', savedAt: '2026-09-09T00:00:00.000Z' },
  ];

  const state = (favorites: FavoritesState) => ({ favorites });

  it('counts the saved entries', () => {
    expect(selectFavoritesCount(state({ ...initialFavoritesState, entries }))).toBe(2);
  });

  it('reports an empty list', () => {
    expect(selectFavoritesAreEmpty(state(initialFavoritesState))).toBeTrue();
    expect(selectFavoritesAreEmpty(state({ ...initialFavoritesState, entries }))).toBeFalse();
  });

  it('selects the resolved items', () => {
    const items = [{ article, savedAt: entries[0].savedAt }];

    expect(selectFavoriteItems(state({ ...initialFavoritesState, items }))).toEqual(items);
  });

  it('reports whether a given article is saved', () => {
    const current = state({ ...initialFavoritesState, entries });

    expect(selectIsFavorite('4')(current)).toBeTrue();
    expect(selectIsFavorite('9')(current)).toBeFalse();
  });
});
