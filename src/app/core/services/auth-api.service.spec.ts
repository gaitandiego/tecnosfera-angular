import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { User } from '../models/user.model';
import { AuthApiService, INVALID_CREDENTIALS_MESSAGE } from './auth-api.service';

describe('AuthApiService', () => {
  let service: AuthApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthApiService);
  });

  it('resolves the admin user for the known credentials', fakeAsync(() => {
    let user: User | undefined;

    service
      .login({ username: 'admin@tecnosfera.co', password: 'admin123', rememberMe: false })
      .subscribe((result) => (user = result));
    tick(200);

    expect(user?.email).toBe('admin@tecnosfera.co');
    expect(user?.role).toBe('admin');
  }));

  it('ignores casing and surrounding spaces in the username', fakeAsync(() => {
    let user: User | undefined;

    service
      .login({ username: '  ADMIN@Tecnosfera.CO ', password: 'admin123', rememberMe: true })
      .subscribe((result) => (user = result));
    tick(200);

    expect(user).toBeDefined();
  }));

  it('fails with the invalid credentials message', fakeAsync(() => {
    let error: Error | undefined;

    service
      .login({ username: 'admin@tecnosfera.co', password: 'wrong', rememberMe: false })
      .subscribe({ error: (err) => (error = err) });
    tick(200);

    expect(error?.message).toBe(INVALID_CREDENTIALS_MESSAGE);
  }));
});
