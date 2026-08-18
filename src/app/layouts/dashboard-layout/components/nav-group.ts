import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { coolShield } from '@ng-icons/coolicons';
import {
  hugeDatabase01,
  hugeExchange01,
  hugeFolder01,
  hugePackage,
  hugePieChart,
  hugeWeightScale,
  hugeShoppingCart01,
  hugeStore01,
  hugeUserGroup,
} from '@ng-icons/huge-icons';
import { lucideChevronRight } from '@ng-icons/lucide';
import { matKeyboardArrowDownFillRound } from '@ng-icons/material-symbols/round';
import { NavItem } from './nav-item';
import { NavigationItem } from '@core/shared-kernel/models/navigation-item.model';

@Component({
  selector: 'app-nav-group',
  imports: [NgIcon, NavItem],
  providers: [
    provideIcons({
      coolShield,
      hugeDatabase01,
      hugeExchange01,
      hugeFolder01,
      hugePackage,
      hugePieChart,
      hugeWeightScale,
      hugeShoppingCart01,
      hugeStore01,
      hugeUserGroup,
      lucideChevronRight,
      matKeyboardArrowDownFillRound,
    }),
  ],
  template: `
    <li>
      <div class="dashboard-nav-collapse" (click)="toggle()">
        <div class="flex items-center gap-2">
          <ng-icon [name]="item().icon" size="1rem" />
          <span>{{ item().label }}</span>
        </div>
        <ng-icon name="matKeyboardArrowDownFillRound" [class.rotate-180]="item().expanded" />
      </div>
      <div
        class="grid transition-[grid-template-rows] duration-300 ease-in-out"
        [class.grid-rows-[1fr]]="item().expanded"
        [class.grid-rows-[0fr]]="!item().expanded"
      >
        <ul class="overflow-hidden">
          @for (child of item().children || []; track child.id) {
            <app-nav-item [item]="child" [useIndicator]="true" />
          }
        </ul>
      </div>
    </li>
  `,
})
export class NavGroup {
  public readonly item = input.required<NavigationItem>();

  toggle() {
    this.item().expanded = !this.item().expanded;
  }
}
