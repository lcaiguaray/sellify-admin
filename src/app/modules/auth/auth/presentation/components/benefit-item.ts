import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerChartBar, tablerReportAnalytics, tablerUsers } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-benefit-item',
  imports: [NgIcon],
  providers: [provideIcons({ tablerChartBar, tablerUsers, tablerReportAnalytics })],
  template: `
    <div
      class="flex items-center bg-panel-card text-panel-card-foreground text-sm rounded-lg border border-panel-border py-3 px-4 gap-2 transition-shadow duration-300 hover:shadow hover:shadow-panel-ring"
    >
      <div class="w-10 h-10 rounded-lg bg-panel flex items-center justify-center">
        <ng-icon [name]="icon()" class="text-panel-foreground" size="1.6em" />
      </div>
      <div>
        <p class="font-medium tracking-wide cursor-default">{{ title() }}</p>
        <p class="text-panel-muted-foreground/60 cursor-default">{{ description() }}</p>
      </div>
    </div>
  `,
})
export default class BenefitItem {
  icon = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
}
