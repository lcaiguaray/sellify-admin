import { Component, input, output } from '@angular/core';
import { HlmSkeletonImports } from '@ui-spartan/skeleton';
import { HlmTableImports } from '@ui-spartan/table';
import StatusBadge from '@ui/status-badge';
import { Product } from '../../domain/models/product.model';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerDots } from '@ng-icons/tabler-icons';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmDropdownMenuImports } from '@ui-spartan/dropdown-menu';
import { hugeDelete04, hugeEdit02 } from '@ng-icons/huge-icons';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-table',
  imports: [
    NgIcon,
    CurrencyPipe,
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
        <td hlmTableCell class="text-center" [attr.colspan]="6">No se encontraron resultados.</td>
      </tr>
    } @else {
      @for (product of data(); track product.id) {
        <tr hlmTableRow>
          <td hlmTableCell>
            <div>{{ product.name }}</div>
            <div class="text-sm font-medium text-muted-foreground">{{ product.categoryName ?? 'Sin Categoría' }}</div>
          </td>
          <td hlmTableCell>{{ product.sku }}</td>
          <td hlmTableCell>{{ product.basePrice | currency: 'USD' }} / {{ product.unitMeasureName ?? 'Und' }}</td>
          <td hlmTableCell>{{ product.initialStock }}</td>
          <td hlmTableCell align="center">
            <app-status-badge [status]="product.active" />
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
                  <button hlmDropdownMenuItem (click)="edit.emit(product)">
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
export default class ProductTable {
  data = input<Product[]>([]);
  edit = output<Product>();
}
