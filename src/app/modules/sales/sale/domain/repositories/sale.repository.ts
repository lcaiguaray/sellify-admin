import { Observable } from 'rxjs';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';
import { CreateSale, Sale, SaleSearchable } from '../models/sale.model';

export abstract class SaleRepository {
  abstract getAll(filters: SaleSearchable): Observable<ApiPageResponse<Sale>>;
  abstract getById(id: string): Observable<ApiResponse<Sale>>;
  abstract create(sale: CreateSale): Observable<ApiResponse<Sale>>;
  abstract enable(id: string): Observable<ApiResponse<void>>;
  abstract disable(id: string): Observable<ApiResponse<void>>;
}
