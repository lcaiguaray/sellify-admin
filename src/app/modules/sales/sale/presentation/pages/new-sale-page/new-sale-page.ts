import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeArrowLeft01, hugeShoppingCart01, hugeUser, hugeCheckmarkCircle01, hugePause } from '@ng-icons/huge-icons';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmCardImports } from '@ui-spartan/card';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HlmInputImports } from '@ui-spartan/input';
import { CartTableComponent } from '../../components/cart-table/cart-table';
import { SaleFacade } from '../../../application/facades/sale.facade';
import { ProductFacade } from '@modules/catalog/product/application/facades/product.facade';
import { HlmDialogService } from '@ui-spartan/dialog';
import { PausedSalesDialogComponent } from '../../components/paused-sales-dialog/paused-sales-dialog';

@Component({
  selector: 'app-new-sale-page',
  standalone: true,
  imports: [
    NgIcon,
    HlmButtonImports,
    HlmCardImports,
    RouterLink,
    CartTableComponent,
    CurrencyPipe,
    FormsModule,
    HlmInputImports
  ],
  providers: [provideIcons({ hugeArrowLeft01, hugeShoppingCart01, hugeUser, hugeCheckmarkCircle01, hugePause })],
  template: `
    <div class="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center gap-3">
        <a hlmBtn variant="ghost" size="icon" routerLink="..">
          <ng-icon name="hugeArrowLeft01" />
        </a>
        <div>
          <h1 class="text-xl font-bold">Nueva Venta</h1>
          <div>Registre los productos y finalice la compra</div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        @if (facade.pausedSales().length > 0) {
          <button hlmBtn variant="outline" (click)="viewPausedSales()">
            Ventas en Espera ({{ facade.pausedSales().length }})
          </button>
        }
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Columna Principal: Selección y Carrito -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Buscador de Productos -->
        <hlm-card>
          <div hlmCardHeader>
            <h3 hlmCardTitle>Agregar Productos</h3>
          </div>
          <div hlmCardContent>
            <!-- A simple mockup for product search, normally it would be a typeahead or select -->
            <div class="flex gap-2">
              <input hlmInput class="flex-1" placeholder="Buscar por nombre o SKU..." [(ngModel)]="searchTerm" />
              <button hlmBtn variant="secondary" (click)="searchProducts()">Buscar</button>
            </div>
            
            @if (products().length > 0 && searchTerm) {
              <div class="mt-4 border rounded-md divide-y max-h-48 overflow-y-auto">
                @for (product of products(); track product.id) {
                  <div class="flex justify-between items-center p-3 hover:bg-muted/50 cursor-pointer" (click)="addProductToCart(product)">
                    <div>
                      <div class="font-medium">{{ product.name }}</div>
                      <div class="text-xs text-muted-foreground">Stock: {{ product.initialStock }} | Precio: {{ product.basePrice | currency:'S/ ' }}</div>
                    </div>
                    <button hlmBtn size="sm" variant="outline">Agregar</button>
                  </div>
                }
              </div>
            }
          </div>
        </hlm-card>

        <!-- Detalle del Carrito -->
        <hlm-card>
          <div hlmCardHeader>
            <h3 hlmCardTitle class="flex items-center gap-2">
              <ng-icon name="hugeShoppingCart01" /> Detalle de Venta
            </h3>
          </div>
          <div hlmCardContent class="p-0">
            <app-cart-table />
          </div>
        </hlm-card>
      </div>

      <!-- Columna Lateral: Cliente y Resumen -->
      <div class="space-y-6">
        <!-- Cliente -->
        <hlm-card>
          <div hlmCardHeader>
            <h3 hlmCardTitle class="flex items-center gap-2">
              <ng-icon name="hugeUser" /> Cliente
            </h3>
          </div>
          <div hlmCardContent>
            <input hlmInput class="w-full" placeholder="Nombre del cliente..." [(ngModel)]="clientName" />
            <div class="text-xs text-muted-foreground mt-2">Dejar como "Cliente Varios" si es venta rápida.</div>
          </div>
        </hlm-card>

        <!-- Resumen -->
        <hlm-card>
          <div hlmCardHeader>
            <h3 hlmCardTitle>Resumen</h3>
          </div>
          <div hlmCardContent class="space-y-4">
            <div class="flex justify-between items-center text-muted-foreground">
              <span>Subtotal</span>
              <span>{{ facade.cartSubtotal() | currency:'S/ ' }}</span>
            </div>
            <div class="flex justify-between items-center text-muted-foreground">
              <span>IGV (0%)</span>
              <span>{{ 0 | currency:'S/ ' }}</span>
            </div>
            <div class="border-t pt-4 flex justify-between items-center font-bold text-lg">
              <span>Total</span>
              <span>{{ facade.cartTotal() | currency:'S/ ' }}</span>
            </div>
          </div>
          <div hlmCardFooter class="flex flex-col gap-2">
            <button 
              hlmBtn 
              class="w-full" 
              [disabled]="facade.cartItems().length === 0 || facade.isLoading()"
              (click)="finishSale()"
            >
              @if (facade.isLoading()) {
                Procesando...
              } @else {
                <ng-icon name="hugeCheckmarkCircle01" class="mr-2" /> Completar Venta
              }
            </button>
            <button 
              hlmBtn 
              variant="outline"
              class="w-full" 
              [disabled]="facade.cartItems().length === 0 || facade.isLoading()"
              (click)="pauseSale()"
            >
              <ng-icon name="hugePause" class="mr-2" /> Pausar Venta
            </button>
          </div>
        </hlm-card>
      </div>
    </div>
  `,
})
export default class NewSalePage {
  readonly facade = inject(SaleFacade);
  readonly productFacade = inject(ProductFacade);
  readonly router = inject(Router);
  readonly dialogService = inject(HlmDialogService);

  searchTerm = '';
  clientName = 'Cliente Varios';
  
  // Using a computed to filter products client-side for simplicity in this demo,
  // in reality this would hit the API via ProductFacade search
  products = this.productFacade.data;

  constructor() {
    this.productFacade.load(); // Load some products initially
  }

  searchProducts() {
    this.productFacade.updateFilters({ search: this.searchTerm });
  }

  addProductToCart(product: any) {
    this.facade.cartService.addItem(product);
    this.searchTerm = '';
  }

  finishSale() {
    this.facade.createSale(undefined, this.clientName);
    // After a short delay, navigate back to list
    setTimeout(() => {
      this.router.navigate(['/admin/sales']);
    }, 600);
  }

  pauseSale() {
    this.facade.pauseCurrentSale(this.clientName);
    this.clientName = 'Cliente Varios';
  }

  async viewPausedSales() {
    const dialogRef = this.dialogService.open(PausedSalesDialogComponent, {
      context: { currentClientName: this.clientName },
    });
    
    dialogRef.closed$.subscribe((resumedClientName) => {
      if (resumedClientName && typeof resumedClientName === 'string') {
        this.clientName = resumedClientName;
      }
    });
  }
}
