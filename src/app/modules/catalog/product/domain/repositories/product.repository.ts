import { Observable } from 'rxjs';
import { Product, ProductSearchable, CreateProduct } from '../models/product.model';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';

export abstract class ProductRepository {
  abstract get(searchable: ProductSearchable): Observable<ApiPageResponse<Product>>;
  abstract findById(id: Product['id']): Observable<ApiResponse<Product>>;
  abstract create(payload: CreateProduct): Observable<ApiResponse<Product>>;
  abstract update(product: Product): Observable<ApiResponse<Product>>;
  abstract enable(id: Product['id']): Observable<ApiResponse<void>>;
  abstract disable(id: Product['id']): Observable<ApiResponse<void>>;
}
