import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/services/base-api.service';
import { map, Observable } from 'rxjs';
import { BrandRepository } from './../domain/repositories/brand.repository';
import { Brand, BrandSearchable, CreateBrand } from './../domain/models/brand.model';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';
import { BrandApiDto } from './dtos/brand-api.dto';
import { BrandMapper } from './mappers/brand.mapper';

@Injectable({ providedIn: 'root' })
export class BrandHttpService extends BaseApiService implements BrandRepository {
  private readonly resource = '/catalog/brands';

  get(searchable: BrandSearchable): Observable<ApiPageResponse<Brand>> {
    const params = this.buildParams(searchable);

    const url = this.buildUrl(this.resource);
    return this.http.get<ApiPageResponse<BrandApiDto>>(url, { params }).pipe(
      map((response) => {
        const data = response.data.content.map(BrandMapper.fromDto);
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

  create(payload: CreateBrand): Observable<ApiResponse<Brand>> {
    const url = this.buildUrl(`${this.resource}`);
    return this.http.post<ApiResponse<BrandApiDto>>(url, payload).pipe(
      map((response) => ({
        ...response,
        data: BrandMapper.fromDto(response.data),
      })),
    );
  }

  update(brand: Brand): Observable<ApiResponse<Brand>> {
    const url = this.buildUrl(`${this.resource}/${brand.id}`);
    return this.http.put<ApiResponse<BrandApiDto>>(url, brand).pipe(
      map((response) => ({
        ...response,
        data: BrandMapper.fromDto(response.data),
      })),
    );
  }

  enable(id: Brand['id']): Observable<ApiResponse<void>> {
    const url = this.buildUrl(`${this.resource}/${id}/enable`);
    return this.http.put<ApiResponse<void>>(url, {});
  }

  disable(id: Brand['id']): Observable<ApiResponse<void>> {
    const url = this.buildUrl(`${this.resource}/${id}/disable`);
    return this.http.put<ApiResponse<void>>(url, {});
  }
}
