import { Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugePlusSign } from '@ng-icons/huge-icons';
import { HlmButtonImports } from '@ui-spartan/button';

@Component({
  selector: 'app-page-header',
  imports: [NgIcon, HlmButtonImports],
  providers: [provideIcons({ hugePlusSign })],
  host: {
    class: 'flex flex-col gap-4 md:flex-row md:items-center md:justify-between display-contents',
  },
  template: `
    <div>
      <h1 class="text-xl font-bold">{{ title() }}</h1>
      @if (description()) {
        <div class="text-muted-foreground">{{ description() }}</div>
      }
    </div>

    @if (actionLabel()) {
      <div class="flex flex-col gap-2 md:flex-row md:items-center">
        <button hlmBtn (click)="action.emit()">
          <ng-icon name="hugePlusSign" />
          {{ actionLabel() }}
        </button>
      </div>
    }
  `,
})
export class PageHeader {
  title = input.required<string>();
  description = input<string>('');
  actionLabel = input<string>('Nuevo');

  action = output<void>();
}
