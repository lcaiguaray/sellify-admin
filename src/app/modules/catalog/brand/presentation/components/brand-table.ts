import { Component, input, output } from '@angular/core';
import { HlmSkeletonImports } from '@ui-spartan/skeleton';
import { HlmTableImports } from '@ui-spartan/table';
import StatusBadge from '@ui/status-badge';
import { Brand } from '../../domain/models/brand.model';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerDots } from '@ng-icons/tabler-icons';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmDropdownMenuImports } from '@ui-spartan/dropdown-menu';
import { hugeDelete04, hugeEdit02 } from '@ng-icons/huge-icons';

@Component({
  selector: 'app-brand-table',
  imports: [
    NgIcon,
    HlmSkeletonImports,
    HlmTableImports,
    HlmButtonImports,
    HlmDropdownMenuImports,
    StatusBadge,
  ],
  providers: [provideIcons({ tablerDots, hugeEdit02, hugeDelete04 })],
  host: {
    style: 'display: contents;',
  },
  template: `
    @if (data().length === 0) {
      <tr hlmTableRow>
        <td hlmTableCell class="text-center" [attr.colspan]="4">No se encontraron resultados.</td>
      </tr>
    } @else {
      @for (brand of data(); track brand.id) {
        <tr hlmTableRow>
          <td hlmTableCell>
            <div>{{ brand.name }}</div>
            <div class="text-sm font-medium text-muted-foreground">{{ brand.slug }}</div>
          </td>
          <td hlmTableCell>{{ brand.description }}</td>
          <td hlmTableCell align="center">
            <app-status-badge [status]="brand.active" />
          </td>
          <td hlmTableCell class="text-center">
            <button
              hlmBtn
              size="icon"
              variant="outline"
              [hlmDropdownMenuTrigger]="menuAction"
              align="end"
            >
              <ng-icon name="tablerDots" />
            </button>

            <ng-template #menuAction>
              <hlm-dropdown-menu>
                <hlm-dropdown-menu-group>
                  <button hlmDropdownMenuItem (click)="edit.emit(brand)">
                    <ng-icon name="hugeEdit02" />
                    Editar
                  </button>
                </hlm-dropdown-menu-group>
                <hlm-dropdown-menu-separator />
                <hlm-dropdown-menu-group>
                  <button hlmDropdownMenuItem variant="destructive">
                    <ng-icon name="hugeDelete04" />
                    Deshabilitar
                  </button>
                </hlm-dropdown-menu-group>
              </hlm-dropdown-menu>
            </ng-template>
          </td>
        </tr>
      }
    }
  `,
})
export default class BrandTable {
  data = input<Brand[]>([]);
  edit = output<Brand>();
}
