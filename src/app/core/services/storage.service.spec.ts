import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  it('returns the fallback when the key is missing', () => {
    expect(service.read('missing-key', ['fallback'])).toEqual(['fallback']);
  });

  it('writes and reads back a serialized value', () => {
    service.write('key', { a: 1 });

    expect(service.read<{ a: number } | null>('key', null)).toEqual({ a: 1 });
  });

  it('returns the fallback when the stored value is not valid JSON', () => {
    localStorage.setItem('broken', '{not json');

    expect(service.read('broken', 'fallback')).toBe('fallback');
  });

  it('removes a stored key', () => {
    service.write('key', 'value');
    service.remove('key');

    expect(service.read('key', null)).toBeNull();
  });

  it('does not throw when localStorage rejects a write', () => {
    spyOn(localStorage, 'setItem').and.throwError('QuotaExceededError');

    expect(() => service.write('key', 'value')).not.toThrow();
  });
});
