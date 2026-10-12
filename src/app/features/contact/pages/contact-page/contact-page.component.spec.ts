import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ContactActions } from '../../store/contact.actions';
import {
  selectContactError,
  selectIsSendingMessage,
  selectMessageWasSent,
} from '../../store/contact.selectors';
import { ContactPageComponent } from './contact-page.component';

describe('ContactPageComponent', () => {
  let fixture: ComponentFixture<ContactPageComponent>;
  let store: MockStore;
  let dispatch: jasmine.Spy;
  let wasSent: MemoizedSelector<Record<string, unknown>, boolean>;

  const fillValidForm = (): void => {
    const form = (fixture.componentInstance as unknown as {
      form: { setValue: (value: unknown) => void };
    }).form;

    form.setValue({
      fullName: 'Diego Gaitán',
      email: 'diego@conectarjdp.com',
      subject: 'proposal',
      body: 'Tengo una propuesta de noticia sobre fibra óptica rural.',
      acceptsDataPolicy: true,
    });
  };

  const submit = (): void =>
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactPageComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectIsSendingMessage, false);
    wasSent = store.overrideSelector(selectMessageWasSent, false);
    store.overrideSelector(selectContactError, null);

    dispatch = spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ContactPageComponent);
    fixture.detectChanges();
  });

  it('does not dispatch anything when the form is empty', () => {
    submit();

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('shows the validation messages after an invalid submit', () => {
    submit();
    fixture.detectChanges();

    const errors: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.field__error'),
    );

    expect(errors.length).toBeGreaterThan(0);
    expect(errors.map((error) => error.textContent?.trim())).toContain(
      'Ingresa un correo electrónico válido',
    );
  });

  it('dispatches the trimmed message when the form is valid', () => {
    fillValidForm();
    submit();

    expect(dispatch).toHaveBeenCalledWith(
      ContactActions.sendMessage({
        message: {
          fullName: 'Diego Gaitán',
          email: 'diego@conectarjdp.com',
          subject: 'proposal',
          body: 'Tengo una propuesta de noticia sobre fibra óptica rural.',
          acceptsDataPolicy: true,
        },
      }),
    );
  });

  it('shows the confirmation once the message was sent', () => {
    wasSent.setResult(true);
    store.refreshState();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('[data-testid="contact-success"]'),
    ).toBeTruthy();
  });

  it('resets the slice when the screen is destroyed', () => {
    fixture.destroy();

    expect(dispatch).toHaveBeenCalledWith(ContactActions.reset());
  });

  afterEach(() => store.resetSelectors());

});
