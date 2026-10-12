import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ImagePlaceholderVariant = 'hero' | 'card' | 'detail' | 'fav';

@Component({
  selector: 'app-image-placeholder',
  templateUrl: './image-placeholder.component.html',
  styleUrl: './image-placeholder.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagePlaceholderComponent {
  readonly src = input<string | null>(null);
  readonly alt = input<string>('');
  readonly variant = input<ImagePlaceholderVariant>('card');
  readonly label = input<string>('IMAGEN');
}
