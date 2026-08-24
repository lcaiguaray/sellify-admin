import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';
import { SaleRepository } from '../../domain/repositories/sale.repository';
import { CreateSale, Sale, SaleSearchable } from '../../domain/models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleApiService implements SaleRepository {
  private mockSales: Sale[] = [];
  
  getAll(filters: SaleSearchable): Observable<ApiPageResponse<Sale>> {
    const data = this.mockSales.filter(s => 
      !filters.search || s.clientName.toLowerCase().includes(filters.search.toLowerCase())
    );
    
    return of({
      data: {
        content: data,
        pageNumber: filters.page ?? 0,
        pageSize: filters.size ?? 10,
        totalPages: Math.ceil(data.length / (filters.size ?? 10)),
        totalElements: data.length,
        isLast: (filters.page ?? 0) >= Math.ceil(data.length / (filters.size ?? 10)) - 1
      },
      message: 'Success',
      success: true,
      status: 200
    }).pipe(delay(500));
  }

  getById(id: string): Observable<ApiResponse<Sale>> {
    const sale = this.mockSales.find(s => s.id === id);
    if (!sale) throw new Error('Sale not found');
    return of({ data: sale, message: 'Success', success: true, status: 200 }).pipe(delay(300));
  }

  create(sale: CreateSale): Observable<ApiResponse<Sale>> {
    const newSale: Sale = {
      ...sale,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true,
      items: sale.items.map(item => ({
        ...item,
        subtotal: item.quantity * item.unitPrice
      }))
    };
    
    this.mockSales.unshift(newSale);
    return of({ data: newSale, message: 'Success', success: true, status: 201 }).pipe(delay(500));
  }

  enable(id: string): Observable<ApiResponse<void>> {
    return of({ data: void 0, message: 'Success', success: true, status: 200 }).pipe(delay(300));
  }

  disable(id: string): Observable<ApiResponse<void>> {
    return of({ data: void 0, message: 'Success', success: true, status: 200 }).pipe(delay(300));
  }
}
