import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/services/base-api.service';
import { map, Observable } from 'rxjs';
import { UnitConversionRepository } from './../domain/repositories/unit-conversion.repository';
import {
  UnitConversion,
  UnitConversionSearchable,
  CreateUnitConversion,
} from './../domain/models/unit-conversion.model';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';
import { UnitConversionApiDto } from './dtos/unit-conversion-api.dto';
import { UnitConversionMapper } from './mappers/unit-conversion.mapper';

@Injectable({ providedIn: 'root' })
export class UnitConversionHttpService
  extends BaseApiService
  implements UnitConversionRepository
{
  private readonly resource = '/catalog/unit-conversions';

  get(searchable: UnitConversionSearchable): Observable<ApiPageResponse<UnitConversion>> {
    const params = this.buildParams(searchable);

    const url = this.buildUrl(this.resource);
    return this.http.get<ApiPageResponse<UnitConversionApiDto>>(url, { params }).pipe(
      map((response) => {
        const data = response.data.content.map(UnitConversionMapper.fromDto);
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

  create(payload: CreateUnitConversion): Observable<ApiResponse<UnitConversion>> {
    const url = this.buildUrl(`${this.resource}`);
    return this.http.post<ApiResponse<UnitConversionApiDto>>(url, payload).pipe(
      map((response) => ({
        ...response,
        data: UnitConversionMapper.fromDto(response.data),
      })),
    );
  }

  update(unitConversion: UnitConversion): Observable<ApiResponse<UnitConversion>> {
    const url = this.buildUrl(`${this.resource}/${unitConversion.id}`);
    return this.http.put<ApiResponse<UnitConversionApiDto>>(url, unitConversion).pipe(
      map((response) => ({
        ...response,
        data: UnitConversionMapper.fromDto(response.data),
      })),
    );
  }

  enable(id: UnitConversion['id']): Observable<ApiResponse<void>> {
    const url = this.buildUrl(`${this.resource}/${id}/enable`);
    return this.http.put<ApiResponse<void>>(url, {});
  }

  disable(id: UnitConversion['id']): Observable<ApiResponse<void>> {
    const url = this.buildUrl(`${this.resource}/${id}/disable`);
    return this.http.put<ApiResponse<void>>(url, {});
  }
}
