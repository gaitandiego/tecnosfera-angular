import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleFormValue } from '../../models/management.model';
import { ArticleFormComponent } from './article-form.component';

describe('ArticleFormComponent', () => {
  let fixture: ComponentFixture<ArticleFormComponent>;
  let emitted: ArticleFormValue[];

  const formOf = (): { setValue: (value: unknown) => void; reset: () => void } =>
    (fixture.componentInstance as unknown as {
      form: { setValue: (value: unknown) => void; reset: () => void };
    }).form;

  const submit = (): void =>
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleFormComponent);
    emitted = [];
    fixture.componentInstance.save.subscribe((draft) => emitted.push(draft));
    fixture.detectChanges();
  });

  it('renders one option per category', () => {
    const options = fixture.nativeElement.querySelectorAll('#category option');

    expect(options.length).toBe(4);
  });

  it('does not emit anything when the form is empty', () => {
    submit();

    expect(emitted).toEqual([]);
  });

  it('shows the validation messages after an invalid submit', () => {
    submit();
    fixture.detectChanges();

    const errors = fixture.nativeElement.querySelectorAll('.field__error');

    expect(errors.length).toBe(3);
  });

  it('emits the draft when the form is valid', () => {
    formOf().setValue({
      title: 'Wi-Fi 7 en Colombia',
      category: 'networks',
      image: 'img/wifi.jpg',
      summary: 'Comparativa de routers disponibles.',
      content: 'Cuerpo de la noticia con suficiente longitud para pasar.',
    });

    submit();

    expect(emitted.length).toBe(1);
    expect(emitted[0].title).toBe('Wi-Fi 7 en Colombia');
    expect(emitted[0].image).toBe('img/wifi.jpg');
  });

  it('usa la imagen por defecto cuando el campo queda vacío', () => {
    formOf().setValue({
      title: 'Wi-Fi 7 en Colombia',
      category: 'networks',
      image: '   ',
      summary: 'Comparativa de routers disponibles.',
      content: 'Cuerpo de la noticia con suficiente longitud para pasar.',
    });

    submit();

    expect(emitted[0].image).toBe('img/news-01.svg');
  });

  it('disables the save button while a request is in flight', () => {
    fixture.componentRef.setInput('isSaving', true);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    );

    expect(button.disabled).toBeTrue();
    expect(button.textContent).toContain('Guardando…');
  });
});
