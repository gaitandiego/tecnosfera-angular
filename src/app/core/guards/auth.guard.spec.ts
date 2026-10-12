import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { selectIsAuthenticated } from '../../features/auth/store/auth.selectors';
import { LOGIN_ROUTE, authGuard } from './auth.guard';

describe('authGuard', () => {
  let store: MockStore;
  let isAuthenticated: MemoizedSelector<Record<string, unknown>, boolean>;

  const run = () =>
    TestBed.runInInjectionContext(() =>
      authGuard(
        {} as ActivatedRouteSnapshot,
        { url: '/gestion' } as RouterStateSnapshot,
      ),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideMockStore()],
    });

    store = TestBed.inject(MockStore);
    isAuthenticated = store.overrideSelector(selectIsAuthenticated, false);
  });

  it('lets an authenticated user through', () => {
    isAuthenticated.setResult(true);
    store.refreshState();

    expect(run()).toBeTrue();
  });

  it('redirects an anonymous visitor to the login route with the target url', () => {
    isAuthenticated.setResult(false);
    store.refreshState();

    const result = run() as UrlTree;
    const router = TestBed.inject(Router);

    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result)).toBe(
      `${LOGIN_ROUTE}?redirectTo=%2Fgestion`,
    );
  });

  afterEach(() => store.resetSelectors());

});
