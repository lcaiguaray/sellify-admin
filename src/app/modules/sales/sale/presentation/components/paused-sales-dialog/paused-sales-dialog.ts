import { Component, inject } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { hugePlay, hugeDelete02 } from '@ng-icons/huge-icons';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmDialogImports } from '@ui-spartan/dialog';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { SaleFacade } from '../../../application/facades/sale.facade';

@Component({
  selector: 'app-paused-sales-dialog',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    NgIcon,
    HlmDialogImports,
    HlmButtonImports,
  ],
  providers: [provideIcons({ hugePlay, hugeDelete02 })],
  host: {
    class: 'flex flex-col gap-4',
  },
  template: `
    <hlm-dialog-header>
      <h3 hlmDialogTitle>Ventas en Espera</h3>
      <p hlmDialogDescription>
        Seleccione una venta pausada para retomarla o elimínela si ya no es necesaria.
      </p>
    </hlm-dialog-header>
    <div class="no-scrollbar -mx-4 max-h-[60vh] overflow-y-auto px-4">
      @if (facade.pausedSales().length === 0) {
        <div class="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
          <p>No hay ventas en espera actualmente.</p>
        </div>
      } @else {
        <div class="flex flex-col gap-3">
          @for (sale of facade.pausedSales(); track sale.id) {
            <div class="flex items-center justify-between rounded-lg border p-4">
              <div class="flex flex-col">
                <span class="font-medium">{{ sale.clientName }}</span>
                <span class="text-sm text-muted-foreground">
                  {{ sale.items.length }} producto(s) &bull; {{ getSaleTotal(sale) | currency:'PEN':'symbol':'1.2-2' }}
                </span>
                <span class="text-xs text-muted-foreground">
                  Pausada: {{ sale.createdAt | date:'shortTime' }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <button hlmBtn variant="outline" size="icon" (click)="resume(sale.id)" title="Retomar">
                  <ng-icon name="hugePlay" />
                </button>
                <button hlmBtn variant="destructive" size="icon" (click)="deleteSale(sale.id)" title="Eliminar">
                  <ng-icon name="hugeDelete02" />
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
    <hlm-dialog-footer>
      <button hlmBtn type="button" variant="outline" (click)="close()">
        Cerrar
      </button>
    </hlm-dialog-footer>
  `,
})
export class PausedSalesDialogComponent {
  public readonly facade = inject(SaleFacade);
  private readonly dialogRef = inject<BrnDialogRef<string>>(BrnDialogRef);
  private readonly _dialogContext = injectBrnDialogContext<{ currentClientName: string }>();

  getSaleTotal(sale: any): number {
    return sale.items.reduce((acc: number, item: any) => acc + item.subtotal, 0);
  }

  resume(id: string) {
    const clientName = this._dialogContext?.currentClientName || 'Cliente Varios';
    const resumedClientName = this.facade.resumePausedSale(id, clientName);
    this.dialogRef.close(resumedClientName);
  }

  deleteSale(id: string) {
    this.facade.deletePausedSale(id);
    if (this.facade.pausedSales().length === 0) {
      this.close();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
