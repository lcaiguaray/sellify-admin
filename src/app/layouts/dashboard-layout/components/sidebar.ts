import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCommand } from '@ng-icons/lucide';
import { hugeArrowDown01 } from '@ng-icons/huge-icons';
import { matKeyboardArrowDownFillRound } from '@ng-icons/material-symbols/round';
import { HlmSidebarImports } from '@ui-spartan/sidebar';
import { NavigationService } from '@core/services/navigation.service';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

@Component({
  selector: 'app-sidebar',
  imports: [HlmSidebarImports, NgIcon, NavMain, NavUser],
  providers: [provideIcons({ lucideCommand, hugeArrowDown01, matKeyboardArrowDownFillRound })],
  template: `
    <div hlmSidebarWrapper>
      <hlm-sidebar variant="inset">
        <hlm-sidebar-header>
          <ul hlmSidebarMenu>
            <li hlmSidebarMenuItem>
              <a hlmSidebarMenuButton size="lg" href="#">
                <div
                  class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
                >
                  <ng-icon name="lucideCommand" class="text-base" />
                </div>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-medium">Acme Inc</span>
                  <span class="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </li>
          </ul>
        </hlm-sidebar-header>

        <hlm-sidebar-content>
          <app-nav-main [items]="navigationService.userMenu()" />
        </hlm-sidebar-content>
        <hlm-sidebar-footer>
          <app-nav-user />
        </hlm-sidebar-footer>
      </hlm-sidebar>
      <ng-content />
    </div>
  `,
})
export class Sidebar {
  readonly navigationService = inject(NavigationService);
}
