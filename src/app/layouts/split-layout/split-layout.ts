import { Component, input } from '@angular/core';

@Component({
  selector: 'app-split-layout',
  host: {
    class: 'block',
  },
  styleUrl: './split-layout.css',
  template: `
    <div class="grid min-h-svh lg:grid-cols-2">
      <div class="flex flex-col p-6 md:p-10" [class]="leftClass()">
        <ng-content select="[left-layout]"></ng-content>
      </div>

      <div
        class="hidden relative overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between"
        [class]="rightClass()"
      >
        <ng-content select="[right-layout]"></ng-content>
      </div>
    </div>
  `,
})
export default class SplitLayout {
  leftClass = input<String>('');
  rightClass = input<String>('');
}
