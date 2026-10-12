import { Article } from '../../../core/models/article.model';
import {
  selectCoverArticle,
  selectHighlights,
  selectIsLoadingHome,
} from './home.selectors';
import { HomeState, initialHomeState } from './home.state';

describe('home selectors', () => {
  const cover = { id: '1', title: 'Portada' } as Article;

  const state = (home: HomeState) => ({ home });

  it('selects the cover article and the highlights', () => {
    const current: HomeState = { ...initialHomeState, cover, highlights: [cover] };

    expect(selectCoverArticle(state(current))).toEqual(cover);
    expect(selectHighlights(state(current))).toEqual([cover]);
  });

  it('treats the idle status as loading so the page never flashes empty', () => {
    expect(selectIsLoadingHome.projector('idle')).toBeTrue();
    expect(selectIsLoadingHome.projector('loading')).toBeTrue();
    expect(selectIsLoadingHome.projector('loaded')).toBeFalse();
  });
});
