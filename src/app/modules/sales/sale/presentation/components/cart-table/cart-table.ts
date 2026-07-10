import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeDelete01 } from '@ng-icons/huge-icons';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmTableImports } from '@ui-spartan/table';
import { HlmInputImports } from '@ui-spartan/input';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../application/services/cart.service';

@Component({
  selector: 'app-cart-table',
  standalone: true,
  imports: [
    NgIcon,
    HlmButtonImports,
    HlmTableImports,
    HlmInputImports,
    CurrencyPipe
  ],
  providers: [provideIcons({ hugeDelete01 })],
  template: `
    <div hlmTableContainer>
      <table hlmTable>
        <thead hlmTableHeader class="bg-muted/50">
          <tr hlmTableRow>
            <th hlmTableHead>Producto</th>
            <th hlmTableHead class="w-32">Cantidad</th>
            <th hlmTableHead class="w-32">Precio Unit.</th>
            <th hlmTableHead class="text-right w-32">Total</th>
            <th hlmTableHead class="w-16 text-center">Acción</th>
          </tr>
        </thead>
        <tbody hlmTableBody>
          @for (item of cartService.items(); track item.productId) {
            <tr hlmTableRow>
              <td hlmTableCell>
                <div class="font-medium">{{ item.productName }}</div>
                <div class="text-xs text-muted-foreground">{{ item.sku }}</div>
              </td>
              <td hlmTableCell>
                <input
                  hlmInput
                  type="number"
                  min="1"
                  class="w-20 text-center h-8"
                  [value]="item.quantity"
                  (change)="onQuantityChange(item.productId, $event)"
                />
              </td>
              <td hlmTableCell>
                <input
                  hlmInput
                  type="number"
                  [min]="item.costPrice"
                  step="0.01"
                  class="w-24 text-right h-8"
                  [value]="item.unitPrice"
                  (change)="onPriceChange(item.productId, $event, item.costPrice)"
                />
                @if (item.unitPrice < item.costPrice) {
                  <div class="text-[10px] text-destructive mt-1">Min: {{ item.costPrice | currency:'S/ ' }}</div>
                }
              </td>
              <td hlmTableCell class="text-right font-medium">
                {{ item.subtotal | currency:'S/ ' }}
              </td>
              <td hlmTableCell class="text-center">
                <button hlmBtn variant="ghost" size="icon" class="text-destructive" (click)="cartService.removeItem(item.productId)">
                  <ng-icon name="hugeDelete01" size="sm" />
                </button>
              </td>
            </tr>
          }
          @if (cartService.items().length === 0) {
            <tr hlmTableRow>
              <td hlmTableCell colspan="5" class="text-center py-8 text-muted-foreground">
                El carrito está vacío
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class CartTableComponent {
  readonly cartService = inject(CartService);

  onQuantityChange(productId: string, event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(value) && value > 0) {
      this.cartService.updateQuantity(productId, value);
    }
  }

  onPriceChange(productId: string, event: Event, costPrice: number) {
    const value = parseFloat((event.target as HTMLInputElement).value);
    if (!isNaN(value)) {
      if (value < costPrice) {
        // Enforce cost price as minimum in UI too
        (event.target as HTMLInputElement).value = costPrice.toString();
        this.cartService.updatePrice(productId, costPrice);
      } else {
        this.cartService.updatePrice(productId, value);
      }
    }
  }
}
