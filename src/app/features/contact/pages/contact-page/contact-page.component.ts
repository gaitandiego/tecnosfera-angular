import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { ToastService } from '../../../../shared/services/toast.service';
import {
  CONTACT_SUBJECT_OPTIONS,
  ContactSubject,
} from '../../models/contact-message.model';
import { ContactActions } from '../../store/contact.actions';
import {
  selectContactError,
  selectIsSendingMessage,
  selectMessageWasSent,
} from '../../store/contact.selectors';

// Longitudes mínimas que exige el formulario, iguales a las del prototipo.
const MIN_NAME_LENGTH = 3;
const MIN_MESSAGE_LENGTH = 15;

// Formulario de contacto con validaciones reactivas. El mensaje se guarda en
// el navegador porque el proyecto todavía no tiene servidor.
@Component({
  selector: 'app-contact-page',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent implements OnDestroy {
  private readonly store = inject(Store);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  protected readonly subjects = CONTACT_SUBJECT_OPTIONS;
  protected readonly isSending = this.store.selectSignal(selectIsSendingMessage);
  protected readonly wasSent = this.store.selectSignal(selectMessageWasSent);
  protected readonly error = this.store.selectSignal(selectContactError);
  protected readonly submitted = signal(false);

  protected readonly form = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(MIN_NAME_LENGTH)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['' as ContactSubject | '', [Validators.required]],
    body: ['', [Validators.required, Validators.minLength(MIN_MESSAGE_LENGTH)]],
    acceptsDataPolicy: [false, [Validators.requiredTrue]],
  });

  // Un campo se marca en rojo cuando es inválido y ya fue tocado o enviado.
  protected isInvalid(control: keyof typeof this.form.controls): boolean {
    const field = this.form.controls[control];
    return field.invalid && (field.touched || this.submitted());
  }

  protected submit(): void {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Revisa los campos marcados en rojo');
      return;
    }

    const value = this.form.getRawValue();

    this.store.dispatch(
      ContactActions.sendMessage({
        message: {
          fullName: value.fullName.trim(),
          email: value.email.trim(),
          subject: value.subject as ContactSubject,
          body: value.body.trim(),
          acceptsDataPolicy: value.acceptsDataPolicy,
        },
      }),
    );

    this.form.reset();
    this.submitted.set(false);
    this.toast.show('Mensaje enviado correctamente');
  }

  // Al salir de la pantalla se limpia el estado para no mostrar el aviso
  // de envío la próxima vez que se entre.
  ngOnDestroy(): void {
    this.store.dispatch(ContactActions.reset());
  }
}
