import { Component, input, output } from '@angular/core';
import { HlmSkeletonImports } from '@ui-spartan/skeleton';
import { HlmTableImports } from '@ui-spartan/table';
import StatusBadge from '@ui/status-badge';
import { InventoryItem } from '../../domain/models/inventory.model';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerDots } from '@ng-icons/tabler-icons';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmDropdownMenuImports } from '@ui-spartan/dropdown-menu';
import { hugeDelete04, hugeEdit02, hugePackageOpen } from '@ng-icons/huge-icons';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-inventory-table',
  imports: [
    NgIcon,
    DecimalPipe,
    HlmSkeletonImports,
    HlmTableImports,
    HlmButtonImports,
    HlmDropdownMenuImports,
    StatusBadge,
  ],
  providers: [provideIcons({ tablerDots, hugeEdit02, hugeDelete04, hugePackageOpen })],
  host: {
    style: 'display: contents;',
  },
  template: `
    @if (data().length === 0) {
      <tr hlmTableRow>
        <td hlmTableCell class="text-center" [attr.colspan]="6">No se encontraron resultados.</td>
      </tr>
    } @else {
      @for (item of data(); track item.id) {
        <tr hlmTableRow>
          <td hlmTableCell>
            <div>{{ item.productName ?? '—' }}</div>
            <div class="text-sm font-medium text-muted-foreground">{{ item.sku ?? '—' }}</div>
          </td>
          <td hlmTableCell>
            <div class="font-medium">{{ item.quantity | number }}</div>
            <div class="text-xs text-muted-foreground">{{ item.unitMeasureName ?? 'Unidades' }}</div>
          </td>
          <td hlmTableCell>{{ item.minStock ?? '—' }}</td>
          <td hlmTableCell>{{ item.warehouseName ?? '—' }}</td>
          <td hlmTableCell align="center">
            <app-status-badge [status]="item.active" />
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
                  <button hlmDropdownMenuItem (click)="fractionate.emit(item)">
                    <ng-icon name="hugePackageOpen" class="mr-2 h-4 w-4" />
                    Desempaquetar / Fraccionar
                  </button>
                  <button hlmDropdownMenuItem (click)="edit.emit(item)">
                    <ng-icon name="hugeEdit02" class="mr-2 h-4 w-4" />
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
export default class InventoryTable {
  data = input<InventoryItem[]>([]);
  edit = output<InventoryItem>();
  fractionate = output<InventoryItem>();
}
