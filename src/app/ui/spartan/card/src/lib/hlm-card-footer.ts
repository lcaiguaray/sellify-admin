import { Directive } from '@angular/core';
import { classes } from '@ui-spartan/utils';

@Directive({
  selector: '[hlmCardFooter],hlm-card-footer',
  host: { 'data-slot': 'card-footer' },
})
export class HlmCardFooter {
  constructor() {
    classes(() => 'rounded-b-xl border-t p-(--card-spacing) flex items-center');
  }
}
