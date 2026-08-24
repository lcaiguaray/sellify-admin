import { Injectable, signal, computed } from '@angular/core';
import { PausedSale, SaleItem } from '../../domain/models/sale.model';
import { Product } from '@modules/catalog/product/domain/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _items = signal<SaleItem[]>([]);
  private _pausedSales = signal<PausedSale[]>([]);
  
  readonly items = this._items.asReadonly();
  readonly pausedSales = this._pausedSales.asReadonly();
  
  readonly subtotal = computed(() => {
    return this._items().reduce((acc, item) => acc + item.subtotal, 0);
  });
  
  readonly total = computed(() => this.subtotal()); // Add tax logic later if needed
  
  addItem(product: Product) {
    this._items.update(items => {
      const existing = items.find(i => i.productId === product.id);
      if (existing) {
        return items.map(i => i.productId === product.id 
          ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.unitPrice }
          : i
        );
      }
      
      const newItem: SaleItem = {
        productId: product.id!,
        productName: product.name,
        sku: product.sku,
        quantity: 1,
        unitPrice: product.basePrice,
        costPrice: product.cost || 0,
        subtotal: product.basePrice
      };
      
      return [...items, newItem];
    });
  }
  
  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) return;
    
    this._items.update(items => 
      items.map(i => i.productId === productId 
        ? { ...i, quantity, subtotal: quantity * i.unitPrice }
        : i
      )
    );
  }
  
  updatePrice(productId: string, newPrice: number) {
    this._items.update(items => 
      items.map(i => {
        if (i.productId === productId) {
          // Validate against cost price
          if (newPrice < i.costPrice) {
            console.warn('Price cannot be lower than cost price');
            return i; // Or throw error/show notification
          }
          return { ...i, unitPrice: newPrice, subtotal: i.quantity * newPrice };
        }
        return i;
      })
    );
  }
  
  removeItem(productId: string) {
    this._items.update(items => items.filter(i => i.productId !== productId));
  }
  
  clearCart() {
    this._items.set([]);
  }
  
  pauseCurrentSale(clientName: string) {
    const currentItems = this._items();
    if (currentItems.length === 0) return;
    
    const pausedSale: PausedSale = {
      id: new Date().getTime().toString(),
      clientName: clientName || 'Cliente Varios',
      items: [...currentItems],
      createdAt: new Date()
    };
    
    this._pausedSales.update(sales => [...sales, pausedSale]);
    this.clearCart();
  }
  
  resumePausedSale(id: string, currentClientName: string): string {
    // If there is an active sale, pause it first
    if (this._items().length > 0) {
      this.pauseCurrentSale(currentClientName);
    }
    
    const saleToResume = this._pausedSales().find(s => s.id === id);
    if (!saleToResume) return 'Cliente Varios';
    
    this._items.set([...saleToResume.items]);
    this.deletePausedSale(id);
    
    return saleToResume.clientName;
  }
  
  deletePausedSale(id: string) {
    this._pausedSales.update(sales => sales.filter(s => s.id !== id));
  }
}
