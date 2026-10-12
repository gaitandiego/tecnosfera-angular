import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';

import { AuthActions } from '../../../features/auth/store/auth.actions';
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from '../../../features/auth/store/auth.selectors';
import { selectFavoritesCount } from '../../../features/favorites/store/favorites.selectors';

// Encabezado común. Muestra el contador de favoritos y cambia el botón de
// Ingresar por el usuario de la sesión cuando el administrador entra.
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly store = inject(Store);

  protected readonly user = this.store.selectSignal(selectCurrentUser);
  protected readonly isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  protected readonly favoritesCount = this.store.selectSignal(selectFavoritesCount);

  protected logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
