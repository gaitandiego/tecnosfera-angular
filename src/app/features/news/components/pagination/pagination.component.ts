import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  readonly currentPage = input.required<number>();
  readonly pages = input.required<readonly number[]>();
  readonly hasPrevious = input<boolean>(false);
  readonly hasNext = input<boolean>(false);
  readonly pageChange = output<number>();

  protected previous(): void {
    if (this.hasPrevious()) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  protected next(): void {
    if (this.hasNext()) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }
}
