import { Observable } from 'rxjs';
import { Category, CategorySearchable, CreateCategory } from '../models/category.model';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';

export abstract class CategoryRepository {
  abstract get(searchable: CategorySearchable): Observable<ApiPageResponse<Category>>;
  abstract create(payload: CreateCategory): Observable<ApiResponse<Category>>;
  abstract update(category: Category): Observable<ApiResponse<Category>>;
  abstract enable(id: Category['id']): Observable<ApiResponse<void>>;
  abstract disable(id: Category['id']): Observable<ApiResponse<void>>;
}
