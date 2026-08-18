import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/services/base-api.service';
import { map, Observable } from 'rxjs';
import { ProductRepository } from './../domain/repositories/product.repository';
import { Product, ProductSearchable, CreateProduct } from './../domain/models/product.model';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';
import { ProductApiDto } from './dtos/product-api.dto';
import { ProductMapper } from './mappers/product.mapper';

@Injectable({ providedIn: 'root' })
export class ProductHttpService extends BaseApiService implements ProductRepository {
  private readonly resource = '/catalog/products';

  get(searchable: ProductSearchable): Observable<ApiPageResponse<Product>> {
    const params = this.buildParams(searchable);

    const url = this.buildUrl(this.resource);
    return this.http.get<ApiPageResponse<ProductApiDto>>(url, { params }).pipe(
      map((response) => {
        const data = response.data.content.map(ProductMapper.fromDto);
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

  findById(id: Product['id']): Observable<ApiResponse<Product>> {
    const url = this.buildUrl(`${this.resource}/${id}`);
    return this.http.get<ApiResponse<ProductApiDto>>(url).pipe(
      map((response) => ({
        ...response,
        data: ProductMapper.fromDto(response.data),
      })),
    );
  }

  create(payload: CreateProduct): Observable<ApiResponse<Product>> {
    const url = this.buildUrl(`${this.resource}`);
    return this.http.post<ApiResponse<ProductApiDto>>(url, ProductMapper.toRequest(payload)).pipe(
      map((response) => ({
        ...response,
        data: ProductMapper.fromDto(response.data),
      })),
    );
  }

  update(product: Product): Observable<ApiResponse<Product>> {
    const url = this.buildUrl(`${this.resource}/${product.id}`);
    return this.http.put<ApiResponse<ProductApiDto>>(url, ProductMapper.toRequest(product)).pipe(
      map((response) => ({
        ...response,
        data: ProductMapper.fromDto(response.data),
      })),
    );
  }

  enable(id: Product['id']): Observable<ApiResponse<void>> {
    const url = this.buildUrl(`${this.resource}/${id}/enable`);
    return this.http.put<ApiResponse<void>>(url, {});
  }

  disable(id: Product['id']): Observable<ApiResponse<void>> {
    const url = this.buildUrl(`${this.resource}/${id}/disable`);
    return this.http.put<ApiResponse<void>>(url, {});
  }
}
