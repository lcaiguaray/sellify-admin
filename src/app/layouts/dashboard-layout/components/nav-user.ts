import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacade } from '@modules/auth';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBadgeCheck,
  lucideBell,
  lucideChevronsUpDown,
  lucideCreditCard,
  lucideLogOut,
  lucideSparkles,
} from '@ng-icons/lucide';
import { HlmAvatarImports } from '@ui-spartan/avatar';
import { HlmDropdownMenuImports } from '@ui-spartan/dropdown-menu';
import { HlmSidebarImports, HlmSidebarService } from '@ui-spartan/sidebar';

@Component({
  selector: 'app-nav-user',
  imports: [HlmSidebarImports, HlmAvatarImports, NgIcon, HlmDropdownMenuImports],
  providers: [
    provideIcons({
      lucideChevronsUpDown,
      lucideSparkles,
      lucideBadgeCheck,
      lucideCreditCard,
      lucideBell,
      lucideLogOut,
    }),
  ],
  template: `
    @let u = user();
    <ul hlmSidebarMenu>
      <li hlmSidebarMenuItem>
        <button
          hlmSidebarMenuButton
          size="lg"
          [hlmDropdownMenuTrigger]="menu"
          [side]="_menuSide()"
          align="end"
        >
          <hlm-avatar class="rounded-lg">
            <img
              [src]="'https://ui-avatars.com/api/?name=' + u?.username"
              [alt]="u?.username"
              hlmAvatarImage
            />
            <span
              class="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
              hlmAvatarFallback
              >{{ userInitials() }}</span
            >
          </hlm-avatar>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-medium">{{ u?.username }}</span>
            <span class="truncate text-xs">{{ u?.identity?.email }}</span>
          </div>
          <ng-icon name="lucideChevronsUpDown" class="ml-auto text-base" />
        </button>
      </li>
    </ul>

    <ng-template #menu>
      <hlm-dropdown-menu class="min-w-56 rounded-lg">
        <hlm-dropdown-menu-label>
          <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <hlm-avatar class="rounded-lg">
              <img
                [src]="'https://ui-avatars.com/api/?name=' + u?.username"
                [alt]="u?.username"
                hlmAvatarImage
              />
              <span
                class="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
                hlmAvatarFallback
                >{{ userInitials() }}</span
              >
            </hlm-avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ u?.username }}</span>
              <span class="truncate text-xs">{{ u?.identity?.email }}</span>
            </div>
          </div>
        </hlm-dropdown-menu-label>
        <hlm-dropdown-menu-separator />
        <button hlmDropdownMenuItem (click)="logout()">
          <ng-icon name="lucideLogOut" />
          Log out
        </button>
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class NavUser {
  public readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);
  private readonly _sidebarService = inject(HlmSidebarService);

  protected readonly _menuSide = computed(() =>
    this._sidebarService.isMobile() ? 'top' : 'right',
  );

  user = this.authFacade.user;

  protected readonly userInitials = computed(() => {
    const name = this.user()?.username;
    if (!name) return '--';
    return name.substring(0, 2).toUpperCase();
  });

  async logout() {
    try {
      await this.authFacade.logout();
    } finally {
      this.router.navigate(['/auth/login']);
    }
  }
}
