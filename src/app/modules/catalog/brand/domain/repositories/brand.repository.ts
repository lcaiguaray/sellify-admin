import { Observable } from 'rxjs';
import { Brand, BrandSearchable, CreateBrand } from '../models/brand.model';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';

export abstract class BrandRepository {
  abstract get(searchable: BrandSearchable): Observable<ApiPageResponse<Brand>>;
  abstract create(payload: CreateBrand): Observable<ApiResponse<Brand>>;
  abstract update(brand: Brand): Observable<ApiResponse<Brand>>;
  abstract enable(id: Brand['id']): Observable<ApiResponse<void>>;
  abstract disable(id: Brand['id']): Observable<ApiResponse<void>>;
}
