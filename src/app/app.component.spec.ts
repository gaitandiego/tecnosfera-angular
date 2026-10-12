import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AppComponent } from './app.component';
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from './features/auth/store/auth.selectors';
import { selectFavoritesCount } from './features/favorites/store/favorites.selectors';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [
            { selector: selectCurrentUser, value: null },
            { selector: selectIsAuthenticated, value: false },
            { selector: selectFavoritesCount, value: 0 },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('renders the shell with header, outlet and footer', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('app-header')).toBeTruthy();
    expect(element.querySelector('main router-outlet')).toBeTruthy();
    expect(element.querySelector('app-footer')).toBeTruthy();
  });

  afterEach(() => store.resetSelectors());
});
