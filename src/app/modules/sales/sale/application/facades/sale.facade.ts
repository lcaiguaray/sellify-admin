import { Injectable, inject, signal } from '@angular/core';
import { SaleApiService } from '../../infrastructure/services/sale-api.service';
import { CreateSale, Sale, SaleSearchable, SaleSearchableDefault } from '../../domain/models/sale.model';
import { CartService } from '../services/cart.service';

@Injectable({
  providedIn: 'root'
})
export class SaleFacade {
  private readonly api = inject(SaleApiService);
  readonly cartService = inject(CartService);

  // State
  private _data = signal<Sale[]>([]);
  private _isLoading = signal<boolean>(false);
  private _pagination = signal({ pageNumber: 0, pageSize: 10, totalPages: 0, totalElements: 0 });
  private _filters = signal<SaleSearchable>({ ...SaleSearchableDefault });

  // Selectors
  readonly data = this._data.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly pagination = this._pagination.asReadonly();
  readonly filters = this._filters.asReadonly();
  
  // Cart selectors directly from cart service
  readonly cartItems = this.cartService.items;
  readonly cartSubtotal = this.cartService.subtotal;
  readonly cartTotal = this.cartService.total;
  readonly pausedSales = this.cartService.pausedSales;

  pauseCurrentSale(clientName: string) {
    this.cartService.pauseCurrentSale(clientName);
  }

  resumePausedSale(id: string, currentClientName: string): string {
    return this.cartService.resumePausedSale(id, currentClientName);
  }

  deletePausedSale(id: string) {
    this.cartService.deletePausedSale(id);
  }

  load() {
    this._isLoading.set(true);
    this.api.getAll(this._filters()).subscribe({
      next: (response) => {
        if (response.data) {
          this._data.set(response.data.content);
          this._pagination.set({
            pageNumber: response.data.pageNumber,
            pageSize: response.data.pageSize,
            totalPages: response.data.totalPages,
            totalElements: response.data.totalElements,
          });
        }
      },
      error: (err) => console.error(err),
      complete: () => this._isLoading.set(false),
    });
  }

  updateFilters(filters: Partial<SaleSearchable>) {
    this._filters.update((current) => ({ ...current, ...filters, page: 0 }));
    this.load();
  }

  changePage(page: number) {
    this._filters.update((current) => ({ ...current, page }));
    this.load();
  }

  changePageSize(size: number) {
    this._filters.update((current) => ({ ...current, size, page: 0 }));
    this.load();
  }
  
  createSale(clientId?: string, clientName: string = 'Cliente Varios') {
    if (this.cartItems().length === 0) return;
    
    this._isLoading.set(true);
    
    const newSale: CreateSale = {
      clientId,
      clientName,
      subtotal: this.cartSubtotal(),
      tax: 0, // Implement tax logic if needed
      total: this.cartTotal(),
      items: this.cartItems().map(item => ({
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        costPrice: item.costPrice
      }))
    };
    
    this.api.create(newSale).subscribe({
      next: (sale) => {
        this.cartService.clearCart();
        this.load();
      },
      error: (err) => console.error(err),
      complete: () => this._isLoading.set(false),
    });
  }
}
