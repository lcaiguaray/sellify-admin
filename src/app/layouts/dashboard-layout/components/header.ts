import { Component } from '@angular/core';
import { HlmBreadcrumbImports } from '@ui-spartan/breadcrumb';
import { HlmSeparatorImports } from '@ui-spartan/separator';
import { HlmSidebarImports } from '@ui-spartan/sidebar';

@Component({
  selector: 'app-header',
  imports: [HlmSidebarImports, HlmSeparatorImports, HlmBreadcrumbImports],
  template: `
    <header class="flex h-16 shrink-0 items-center gap-2">
      <div class="flex items-center gap-2 px-4">
        <button hlmSidebarTrigger></button>
        <hlm-separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
        <nav hlmBreadcrumb>
          <ol hlmBreadcrumbList>
            <li hlmBreadcrumbItem class="hidden sm:block">
              <a hlmBreadcrumbLink link="/">JASNIK</a>
            </li>
            <li hlmBreadcrumbSeparator class="hidden sm:block"></li>
            <li hlmBreadcrumbItem>
              <a hlmBreadcrumbPage>Panel de Control</a>
            </li>
          </ol>
        </nav>
      </div>
    </header>
  `,
})
export class Header {}
