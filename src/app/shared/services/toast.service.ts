import { Injectable, signal } from '@angular/core';

// Tiempo que el aviso permanece en pantalla, igual que en el prototipo.
const VISIBLE_MS = 2200;

// Avisos cortos en la parte inferior de la pantalla. Cualquier pantalla llama
// a show() y el componente app-toast se encarga de mostrarlo.
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly text = signal<string | null>(null);
  private timeout: ReturnType<typeof setTimeout> | null = null;

  readonly message = this.text.asReadonly();

  show(message: string): void {
    this.text.set(message);

    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => this.text.set(null), VISIBLE_MS);
  }
}
