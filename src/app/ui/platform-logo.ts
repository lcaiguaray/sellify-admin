import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeShoppingBag01 } from '@ng-icons/huge-icons';

@Component({
  selector: 'app-platform-logo',
  imports: [NgIcon],
  providers: [provideIcons({ hugeShoppingBag01 })],
  template: `
    @if (layout() == 'inline') {
      <div class="flex items-center gap-2 text-white">
        <div class="w-9 h-9 rounded-lg bg-primary/50 flex items-center justify-center">
          <ng-icon name="hugeShoppingBag01" />
        </div>

        <span class="font-bold font-inter text-2xl leading-none tracking-wider">JASNIK</span>
      </div>
    }
  `,
})
export class PlatformLogo {
  layout = input<'inline' | 'vertical'>('inline');
}
