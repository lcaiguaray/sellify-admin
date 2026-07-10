import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/services/base-api.service';
import { map, Observable } from 'rxjs';
import { UnitMeasureRepository } from './../domain/repositories/unit-measure.repository';
import { UnitMeasure, UnitMeasureSearchable, CreateUnitMeasure } from './../domain/models/unit-measure.model';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';
import { UnitMeasureApiDto } from './dtos/unit-measure-api.dto';
import { UnitMeasureMapper } from './mappers/unit-measure.mapper';

@Injectable({ providedIn: 'root' })
export class UnitMeasureHttpService extends BaseApiService implements UnitMeasureRepository {
  private readonly resource = '/catalog/unit-measures';

  get(searchable: UnitMeasureSearchable): Observable<ApiPageResponse<UnitMeasure>> {
    const params = this.buildParams(searchable);

    const url = this.buildUrl(this.resource);
    return this.http.get<ApiPageResponse<UnitMeasureApiDto>>(url, { params }).pipe(
      map((response) => {
        const data = response.data.content.map(UnitMeasureMapper.fromDto);
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

  create(payload: CreateUnitMeasure): Observable<ApiResponse<UnitMeasure>> {
    const url = this.buildUrl(`${this.resource}`);
    return this.http.post<ApiResponse<UnitMeasureApiDto>>(url, payload).pipe(
      map((response) => ({
        ...response,
        data: UnitMeasureMapper.fromDto(response.data),
      })),
    );
  }

  update(unitMeasure: UnitMeasure): Observable<ApiResponse<UnitMeasure>> {
    const url = this.buildUrl(`${this.resource}/${unitMeasure.id}`);
    return this.http.put<ApiResponse<UnitMeasureApiDto>>(url, unitMeasure).pipe(
      map((response) => ({
        ...response,
        data: UnitMeasureMapper.fromDto(response.data),
      })),
    );
  }

  enable(id: UnitMeasure['id']): Observable<ApiResponse<void>> {
    const url = this.buildUrl(`${this.resource}/${id}/enable`);
    return this.http.put<ApiResponse<void>>(url, {});
  }

  disable(id: UnitMeasure['id']): Observable<ApiResponse<void>> {
    const url = this.buildUrl(`${this.resource}/${id}/disable`);
    return this.http.put<ApiResponse<void>>(url, {});
  }
}
