import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { User } from '../../../core/models/user.model';
import { AuthActions } from '../../../features/auth/store/auth.actions';
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from '../../../features/auth/store/auth.selectors';
import { selectFavoritesCount } from '../../../features/favorites/store/favorites.selectors';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let store: MockStore;
  let currentUser: MemoizedSelector<Record<string, unknown>, User | null>;
  let isAuthenticated: MemoizedSelector<Record<string, unknown>, boolean>;

  const user: User = { email: 'admin@tecnosfera.co', displayName: 'Administrador', role: 'admin' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([]), provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    currentUser = store.overrideSelector(selectCurrentUser, null);
    isAuthenticated = store.overrideSelector(selectIsAuthenticated, false);
    store.overrideSelector(selectFavoritesCount, 0);

    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
  });

  it('shows the sign-in link and hides the management entry for a visitor', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('a[href="/ingresar"]')).toBeTruthy();
    expect(element.querySelector('a[href="/gestion"]')).toBeNull();
    expect(element.querySelector('[data-testid="current-user"]')).toBeNull();
  });

  it('shows the user email and the management entry once signed in', () => {
    currentUser.setResult(user);
    isAuthenticated.setResult(true);
    store.refreshState();
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('[data-testid="current-user"]')?.textContent).toContain(
      user.email,
    );
    expect(element.querySelector('a[href="/gestion"]')).toBeTruthy();
    expect(element.querySelector('a[href="/ingresar"]')).toBeNull();
  });

  it('dispatches logout when the sign-out button is clicked', () => {
    const dispatch = spyOn(store, 'dispatch');
    currentUser.setResult(user);
    isAuthenticated.setResult(true);
    store.refreshState();
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.header__user button').click();

    expect(dispatch).toHaveBeenCalledWith(AuthActions.logout());
  });

  afterEach(() => store.resetSelectors());

});
