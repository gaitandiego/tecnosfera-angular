import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let fixture: ComponentFixture<PaginationComponent>;

  const buttons = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('button'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    fixture.componentRef.setInput('currentPage', 2);
    fixture.componentRef.setInput('pages', [1, 2, 3]);
    fixture.componentRef.setInput('hasPrevious', true);
    fixture.componentRef.setInput('hasNext', true);
    fixture.detectChanges();
  });

  it('renders one button per page between the previous and next controls', () => {
    expect(buttons().map((button) => button.textContent?.trim())).toEqual([
      'Anterior',
      '1',
      '2',
      '3',
      'Siguiente',
    ]);
  });

  it('highlights the current page', () => {
    const current = buttons().find((button) => button.classList.contains('btn--dark'));

    expect(current?.textContent?.trim()).toBe('2');
  });

  it('emits the requested page number', () => {
    const emitted: number[] = [];
    fixture.componentInstance.pageChange.subscribe((page) => emitted.push(page));

    buttons()[3].click();

    expect(emitted).toEqual([3]);
  });

  it('emits the neighbouring pages from the previous and next controls', () => {
    const emitted: number[] = [];
    fixture.componentInstance.pageChange.subscribe((page) => emitted.push(page));

    buttons()[0].click();
    buttons()[4].click();

    expect(emitted).toEqual([1, 3]);
  });

  it('disables the controls at the edges of the range', () => {
    fixture.componentRef.setInput('hasPrevious', false);
    fixture.componentRef.setInput('hasNext', false);
    fixture.detectChanges();

    expect(buttons()[0].disabled).toBeTrue();
    expect(buttons()[4].disabled).toBeTrue();
  });
});
