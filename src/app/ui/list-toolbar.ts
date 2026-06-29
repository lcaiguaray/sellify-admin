import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeSearch01 } from '@ng-icons/huge-icons';
import { HlmInputGroupImports } from '@ui-spartan/input-group';
import { HlmInputImports } from '@ui-spartan/input';

@Component({
  selector: 'app-list-toolbar',
  imports: [NgIcon, HlmInputImports, HlmInputGroupImports, FormsModule],
  providers: [provideIcons({ hugeSearch01 })],
  host: {
    class: 'flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2',
  },
  template: `
    <div class="flex-1 w-full sm:w-auto">
      <hlm-input-group>
        <input
          hlmInputGroupInput
          placeholder="Buscar..."
          [ngModel]="searchTerm()"
          (ngModelChange)="searchChange.emit($event)"
        />
        <hlm-input-group-addon>
          <ng-icon name="hugeSearch01" />
        </hlm-input-group-addon>
      </hlm-input-group>
    </div>

    <div class="flex items-center justify-center gap-2 sm:justify-end">
      <ng-content></ng-content>
    </div>
  `,
})
export class ListToolbar {
  searchTerm = input<string | undefined>('');
  searchChange = output<string>();
}
