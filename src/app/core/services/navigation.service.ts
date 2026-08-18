import { Injectable, inject, computed } from '@angular/core';
import { isActive, IsActiveMatchOptions, NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { NAVIGATION_ITEMS } from '@core/config/navigation.config';
import { NavigationItem } from '@core/shared-kernel/models/navigation-item.model';
import { AuthFacade } from '@modules/auth';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  public readonly userMenu = computed(() => {
    const user = this.authFacade.user();
    this.currentUrl();

    if (!user) return [];

    return this.buildMenu(NAVIGATION_ITEMS, user.permissions ?? []);
  });

  private buildMenu(items: NavigationItem[], userPermissions: string[]): NavigationItem[] {
    const processedItems: NavigationItem[] = [];

    for (const item of items) {
      if (item.permissions && !item.permissions.some((p) => userPermissions.includes(p))) {
        continue;
      }

      const clonedItem: NavigationItem = { ...item, expanded: false };

      if (clonedItem.children && clonedItem.children.length > 0) {
        const hadChildren = clonedItem.children.length > 0;
        clonedItem.children = this.buildMenu(clonedItem.children, userPermissions);

        if (hadChildren && clonedItem.children.length === 0) {
          continue;
        }

        if (clonedItem.children.some((child) => child.expanded)) {
          clonedItem.expanded = true;
        }
      }

      if (clonedItem.route) {
        const matchOptions = this.getStrictMatchOptions(clonedItem.activeOptions);
        if (isActive(clonedItem.route, this.router, matchOptions)) {
          clonedItem.expanded = true;
        }
      }

      processedItems.push(clonedItem);
    }

    return processedItems;
  }

  private getStrictMatchOptions(options?: any): IsActiveMatchOptions {
    if (options && typeof options.exact === 'boolean') {
      return {
        paths: options.exact ? 'exact' : 'subset',
        queryParams: options.exact ? 'exact' : 'subset',
        fragment: 'ignored',
        matrixParams: 'ignored',
      };
    }

    return {
      paths: options?.paths ?? 'subset',
      queryParams: options?.queryParams ?? 'subset',
      fragment: options?.fragment ?? 'ignored',
      matrixParams: options?.matrixParams ?? 'ignored',
    };
  }
}
