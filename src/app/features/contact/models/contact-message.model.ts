// Asuntos del formulario de contacto, con los mismos valores del prototipo.
export type ContactSubject = 'proposal' | 'correction' | 'inquiry';

export interface ContactMessage {
  readonly fullName: string;
  readonly email: string;
  readonly subject: ContactSubject;
  readonly body: string;
  readonly acceptsDataPolicy: boolean;
}

export type ContactStatus = 'idle' | 'sending' | 'sent' | 'error';

export const CONTACT_SUBJECT_OPTIONS: readonly {
  value: ContactSubject;
  label: string;
}[] = [
  { value: 'proposal', label: 'Propuesta de noticia' },
  { value: 'correction', label: 'Corrección' },
  { value: 'inquiry', label: 'Consulta general' },
];
