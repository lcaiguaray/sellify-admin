import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { Breakpoint } from '@app/core/services/breakpoint';
import { AdminSidebar } from './components/sidebar';
import { SchemeSwitcher } from './components/scheme-switcher';

@Component({
  selector: 'admin-layout',
  imports: [
    MatButtonModule,
    RouterOutlet,
    MatSidenavContainer,
    MatSidenav,
    AdminSidebar,
    SchemeSwitcher,
    MatSidenavContent,
  ],
  template: `
    <mat-sidenav-container class="flex-auto">
      <mat-sidenav
        [mode]="isMobile() ? 'over' : 'side'"
        [opened]="!isMobile()"
        [disableClose]="!isMobile()"
        fixedInViewport
        #sidenav="matSidenav"
      >
        <admin-sidebar />
      </mat-sidenav>

      <mat-sidenav-content class="overflow-hidden lg:pr-2">
        <div class="flex flex-auto flex-col">
          <!-- Header -->
          <div class="flex items-center px-4 py-3">
            <button matIconButton (click)="sidenav.toggle()">
              @if (sidenav.opened) {
                <span class="iconify tabler--arrow-bar-left size-4"></span>
              } @else {
                <span class="iconify tabler--arrow-bar-right size-4"></span>
              }
            </button>

            <!-- Spacer -->
            <div class="flex-auto"></div>

            <div class="flex items-center gap-x-2">
              <scheme-switcher />
            </div>
          </div>

          <!-- Content -->
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
})
export default class AdminLayout {
  // Dependencies
  private media = inject(Breakpoint);

  // State
  protected isMobile = computed(() => this.media.match(`(max-width: 1023px)`)());
}
