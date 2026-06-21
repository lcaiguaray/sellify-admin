import { Component, input } from '@angular/core';
import { HlmSidebarImports } from '@ui-spartan/sidebar';
import { NavItem } from './nav-item';
import { NavGroup } from './nav-group';
import { NavigationItem } from '@core/shared-kernel/models/navigation-item.model';

@Component({
  selector: 'app-nav-main',
  imports: [HlmSidebarImports, NavItem, NavGroup],
  template: `
    <div>
      @for (item of items(); track item.id) {
        @if (item.label) {
          <div class="dashboard-nav-group-title">{{ item.label }}</div>
        }

        <ul>
          @for (child of item.children || []; track child.id) {
            @if (child.children) {
              <app-nav-group [item]="child" />
            } @else {
              <app-nav-item [item]="child" />
            }
          }
        </ul>
      }
    </div>
  `,
})
export class NavMain {
  public readonly items = input.required<NavigationItem[]>();
}
