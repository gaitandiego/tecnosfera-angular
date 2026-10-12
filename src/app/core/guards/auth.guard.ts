import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { selectIsAuthenticated } from '../../features/auth/store/auth.selectors';

export const LOGIN_ROUTE = '/ingresar';

export const authGuard: CanActivateFn = (_route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  if (store.selectSignal(selectIsAuthenticated)()) {
    return true;
  }

  return router.createUrlTree([LOGIN_ROUTE], {
    queryParams: { redirectTo: state.url },
  });
};
