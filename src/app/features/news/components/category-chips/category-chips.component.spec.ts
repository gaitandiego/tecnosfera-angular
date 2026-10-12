import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryFilter } from '../../../../core/models/category.model';
import { CategoryChipsComponent } from './category-chips.component';

describe('CategoryChipsComponent', () => {
  let fixture: ComponentFixture<CategoryChipsComponent>;

  const chips = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('.chip'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryChipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryChipsComponent);
    fixture.componentRef.setInput('selected', 'all');
    fixture.detectChanges();
  });

  it('renders one chip per category plus the "Todas" option', () => {
    expect(chips().map((chip) => chip.textContent?.trim())).toEqual([
      'Todas',
      'Tecnología',
      'Redes',
      'Ciberseguridad',
      'IA',
    ]);
  });

  it('marks the selected category as active', () => {
    fixture.componentRef.setInput('selected', 'networks');
    fixture.detectChanges();

    const active = chips().filter((chip) => chip.classList.contains('is-active'));

    expect(active.length).toBe(1);
    expect(active[0].textContent?.trim()).toBe('Redes');
  });

  it('emits the category when a chip is clicked', () => {
    const emitted: CategoryFilter[] = [];
    fixture.componentInstance.categoryChange.subscribe((value) => emitted.push(value));

    chips()[3].click();

    expect(emitted).toEqual(['security']);
  });
});
