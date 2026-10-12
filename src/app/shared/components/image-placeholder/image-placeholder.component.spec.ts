import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagePlaceholderComponent } from './image-placeholder.component';

describe('ImagePlaceholderComponent', () => {
  let fixture: ComponentFixture<ImagePlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagePlaceholderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImagePlaceholderComponent);
  });

  it('renders the placeholder box when there is no image', () => {
    fixture.componentRef.setInput('src', null);
    fixture.componentRef.setInput('label', 'IMAGEN DESTACADA');
    fixture.detectChanges();

    const placeholder: HTMLElement = fixture.nativeElement.querySelector('.img-ph');
    expect(placeholder).toBeTruthy();
    expect(placeholder.textContent?.trim()).toBe('IMAGEN DESTACADA');
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
  });

  it('renders an image when a source is provided', () => {
    fixture.componentRef.setInput('src', 'img/foto.jpg');
    fixture.componentRef.setInput('alt', 'Descripción');
    fixture.detectChanges();

    const image: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(image).toBeTruthy();
    expect(image.getAttribute('alt')).toBe('Descripción');
    expect(fixture.nativeElement.querySelector('.img-ph')).toBeNull();
  });

  it('applies the variant modifier class', () => {
    fixture.componentRef.setInput('variant', 'hero');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.img-ph--hero')).toBeTruthy();
  });
});
