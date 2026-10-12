import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
  });

  it('renders the current year in the copyright line', () => {
    const text: string = fixture.nativeElement.textContent;

    expect(text).toContain(String(new Date().getFullYear()));
  });

  it('renders the four navigation links', () => {
    const links: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.footer__inner a'),
    );

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/',
      '/noticias',
      '/favoritos',
      '/contacto',
    ]);
  });
});
