import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ArticleCategory } from '../../../../core/models/article.model';
import { CATEGORY_OPTIONS } from '../../../../core/models/category.model';
import { ArticleFormValue } from '../../models/management.model';

// Imagen que se usa cuando el administrador no indica ninguna.
const DEFAULT_IMAGE = 'img/news-01.svg';

// Formulario de alta de noticias. Valida los campos obligatorios y entrega
// los datos a la pantalla de gestión, que es la que despacha la acción.
@Component({
  selector: 'app-article-form',
  imports: [ReactiveFormsModule],
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleFormComponent {
  private readonly formBuilder = inject(FormBuilder);

  readonly isSaving = input<boolean>(false);
  readonly save = output<ArticleFormValue>();

  protected readonly categories = CATEGORY_OPTIONS;
  protected readonly submitted = signal(false);

  protected readonly form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    category: ['technology' as ArticleCategory, [Validators.required]],
    image: [''],
    summary: ['', [Validators.required, Validators.minLength(10)]],
    content: ['', [Validators.required, Validators.minLength(20)]],
  });

  protected isInvalid(control: keyof typeof this.form.controls): boolean {
    const field = this.form.controls[control];
    return field.invalid && (field.touched || this.submitted());
  }

  protected submit(): void {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.save.emit({
      title: value.title,
      category: value.category,
      image: value.image.trim() ? value.image.trim() : DEFAULT_IMAGE,
      summary: value.summary,
      content: value.content,
    });

    this.reset();
  }

  protected reset(): void {
    this.form.reset({ category: 'technology' });
    this.submitted.set(false);
  }
}
