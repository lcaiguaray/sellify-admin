import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationItem } from '@core/shared-kernel/models/navigation-item.model';
import { coolShield } from '@ng-icons/coolicons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugePieChart } from '@ng-icons/huge-icons';
import { HlmCollapsibleImports } from '@ui-spartan/collapsible';
import { HlmSidebarImports } from '@ui-spartan/sidebar';

@Component({
  selector: 'app-nav-item',
  imports: [HlmSidebarImports, NgIcon, HlmCollapsibleImports, RouterLink, RouterLinkActive],
  providers: [provideIcons({ coolShield, hugePieChart })],
  template: `
    <li>
      <a [routerLink]="item().route" routerLinkActive="dashboard-nav-active" class="dashboard-nav-item">
        @if (useIndicator()) {
          <div class="flex items-center justify-center w-5 h-full">
            <div class="dashboard-nav-item-indicator"></div>
          </div>
        }

        <ng-icon [name]="item().icon" size="1rem" />
        <span>{{ item().label }}</span>
      </a>
    </li>
  `,
})
export class NavItem {
  public readonly item = input.required<NavigationItem>();
  public readonly useIndicator = input<boolean>(false);
}
