import { Pipe, PipeTransform } from '@angular/core';

// Abreviaturas de los meses tal como se muestran en el portal.
const MONTHS = [
  'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
  'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC',
];

// Convierte la fecha del JSON (2026-09-12) en el formato visible: 12 SEP 2026.
@Pipe({ name: 'articleDate' })
export class ArticleDatePipe implements PipeTransform {
  transform(date: string | null | undefined): string {
    if (!date) {
      return '';
    }

    const parts = date.split('-');

    if (parts.length !== 3) {
      return date;
    }

    const month = MONTHS[Number(parts[1]) - 1] ?? parts[1];

    return `${parts[2]} ${month} ${parts[0]}`;
  }
}
