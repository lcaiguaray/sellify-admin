import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseApiService } from '@core/services/base-api.service';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';
import {
  CreateLookupValue,
  LookupValue,
  LookupValueSearchable,
} from '../domain/models/lookup-value.model';
import { LookupValueRepository } from '../domain/repositories/lookup-value.repository';
import { LookupValueApiDto } from './dtos/lookup-value-api.dto';
import { LookupValueMapper } from './mappers/lookup-value.mapper';

@Injectable({ providedIn: 'root' })
export class LookupValueHttpService extends BaseApiService implements LookupValueRepository {
  private readonly resource = '/core/lookup-values';

  get(searchable: LookupValueSearchable): Observable<ApiPageResponse<LookupValue>> {
    return this.http
      .get<ApiPageResponse<LookupValueApiDto>>(this.buildUrl(this.resource), {
        params: this.buildParams(searchable),
      })
      .pipe(
        map((response) => ({
          ...response,
          data: {
            ...response.data,
            content: response.data.content.map((item) => LookupValueMapper.fromDto(item)!),
          },
        })),
      );
  }

  findById(id: string): Observable<ApiResponse<LookupValue>> {
    return this.mapResponse(
      this.http.get<ApiResponse<LookupValueApiDto>>(this.buildUrl(`${this.resource}/${id}`)),
    );
  }

  create(payload: CreateLookupValue): Observable<ApiResponse<LookupValue>> {
    return this.mapResponse(
      this.http.post<ApiResponse<LookupValueApiDto>>(this.buildUrl(this.resource), payload),
    );
  }

  enable(id: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(this.buildUrl(`${this.resource}/${id}/enable`), {});
  }

  disable(id: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(this.buildUrl(`${this.resource}/${id}/disable`), {});
  }

  private mapResponse(
    source: Observable<ApiResponse<LookupValueApiDto>>,
  ): Observable<ApiResponse<LookupValue>> {
    return source.pipe(
      map((response) => ({ ...response, data: LookupValueMapper.fromDto(response.data)! })),
    );
  }
}
