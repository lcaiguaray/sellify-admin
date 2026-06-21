import { Component, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  imports: [],
  template: `
    <div
      class="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
      [class]="
        status()
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-red-50 text-rose-700 border-red-200'
      "
    >
      <span
        class="h-1.5 w-1.5 rounded-full"
        [class]="status() ? 'bg-emerald-500 motion-safe:animate-pulse' : 'bg-rose-500'"
        aria-hidden="true"
      >
      </span>

      <span>{{ status() ? 'Activo' : 'Inactivo' }}</span>
    </div>
  `,
})
export default class StatusBadge {
  status = input<boolean>(false);
}
