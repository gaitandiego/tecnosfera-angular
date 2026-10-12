import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBoxComponent } from './search-box.component';

describe('SearchBoxComponent', () => {
  let fixture: ComponentFixture<SearchBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBoxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBoxComponent);
    fixture.componentRef.setInput('term', 'fibra');
    fixture.detectChanges();
  });

  it('shows the current term', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');

    expect(input.value).toBe('fibra');
  });

  it('emits the typed value', () => {
    const emitted: string[] = [];
    fixture.componentInstance.termChange.subscribe((value) => emitted.push(value));

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'ipv6';
    input.dispatchEvent(new Event('input'));

    expect(emitted).toEqual(['ipv6']);
  });
});
