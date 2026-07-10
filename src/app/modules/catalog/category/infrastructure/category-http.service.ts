import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/services/base-api.service';
import { map, Observable } from 'rxjs';
import { CategoryRepository } from './../domain/repositories/category.repository';
import { Category, CategorySearchable, CreateCategory } from './../domain/models/category.model';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';
import { CategoryApiDto } from './dtos/category-api.dto';
import { CategoryMapper } from './mappers/category.mapper';

@Injectable({ providedIn: 'root' })
export class CategoryHttpService extends BaseApiService implements CategoryRepository {
  private readonly resource = '/catalog/categories';

  get(searchable: CategorySearchable): Observable<ApiPageResponse<Category>> {
    const params = this.buildParams(searchable);

    const url = this.buildUrl(this.resource);
    return this.http.get<ApiPageResponse<CategoryApiDto>>(url, { params }).pipe(
      map((response) => {
        const data = response.data.content.map(CategoryMapper.fromDto);
        return {
          ...response,
          data: {
            ...response.data,
            content: data,
          },
        };
      }),
    );
  }

  create(payload: CreateCategory): Observable<ApiResponse<Category>> {
    const url = this.buildUrl(`${this.resource}`);
    return this.http.post<ApiResponse<CategoryApiDto>>(url, payload).pipe(
      map((response) => ({
        ...response,
        data: CategoryMapper.fromDto(response.data),
      })),
    );
  }

  update(category: Category): Observable<ApiResponse<Category>> {
    const url = this.buildUrl(`${this.resource}/${category.id}`);
    return this.http.put<ApiResponse<CategoryApiDto>>(url, category).pipe(
      map((response) => ({
        ...response,
        data: CategoryMapper.fromDto(response.data),
      })),
    );
  }

  enable(id: Category['id']): Observable<ApiResponse<void>> {
    const url = this.buildUrl(`${this.resource}/${id}/enable`);
    return this.http.put<ApiResponse<void>>(url, {});
  }

  disable(id: Category['id']): Observable<ApiResponse<void>> {
    const url = this.buildUrl(`${this.resource}/${id}/disable`);
    return this.http.put<ApiResponse<void>>(url, {});
  }
}
