import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent {
  readonly term = input<string>('');
  readonly placeholder = input<string>('Buscar noticia…');
  readonly termChange = output<string>();

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.termChange.emit(target.value);
  }
}
