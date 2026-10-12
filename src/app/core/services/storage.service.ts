import { Injectable } from '@angular/core';

// Lectura y escritura del localStorage en un solo lugar. Todo va dentro de
// try/catch porque el navegador puede tener el almacenamiento bloqueado.
@Injectable({ providedIn: 'root' })
export class StorageService {
  read<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  }

  write(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Si el almacenamiento está lleno o bloqueado se continúa sin guardar.
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Igual que en write: el error no debe interrumpir la aplicación.
    }
  }
}
