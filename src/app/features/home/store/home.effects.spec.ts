import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';

import { Article } from '../../../core/models/article.model';
import { HomeContent } from '../models/home.model';
import { HomeService } from '../services/home.service';
import { HomeActions } from './home.actions';
import { HomeEffects } from './home.effects';

describe('HomeEffects', () => {
  let actions$: Observable<unknown>;
  let effects: HomeEffects;
  let homeService: jasmine.SpyObj<HomeService>;

  const content: HomeContent = {
    cover: { id: '1' } as Article,
    highlights: [{ id: '2' } as Article],
  };

  beforeEach(() => {
    homeService = jasmine.createSpyObj<HomeService>('HomeService', ['getContent']);

    TestBed.configureTestingModule({
      providers: [
        HomeEffects,
        provideMockActions(() => actions$),
        { provide: HomeService, useValue: homeService },
      ],
    });

    effects = TestBed.inject(HomeEffects);
  });

  it('maps the resolved content to loadContentSuccess', (done) => {
    homeService.getContent.and.returnValue(of(content));
    actions$ = of(HomeActions.loadContent());

    effects.loadContent$.subscribe((action) => {
      expect(action).toEqual(HomeActions.loadContentSuccess({ content }));
      done();
    });
  });

  it('maps a rejected request to loadContentFailure', (done) => {
    homeService.getContent.and.returnValue(throwError(() => new Error('boom')));
    actions$ = of(HomeActions.loadContent());

    effects.loadContent$.subscribe((action) => {
      expect(action.type).toBe(HomeActions.loadContentFailure.type);
      done();
    });
  });
});
