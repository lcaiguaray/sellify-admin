import { Observable } from 'rxjs';
import { UnitConversion, UnitConversionSearchable, CreateUnitConversion } from '../models/unit-conversion.model';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';

export abstract class UnitConversionRepository {
  abstract get(searchable: UnitConversionSearchable): Observable<ApiPageResponse<UnitConversion>>;
  abstract create(payload: CreateUnitConversion): Observable<ApiResponse<UnitConversion>>;
  abstract update(unitConversion: UnitConversion): Observable<ApiResponse<UnitConversion>>;
  abstract enable(id: UnitConversion['id']): Observable<ApiResponse<void>>;
  abstract disable(id: UnitConversion['id']): Observable<ApiResponse<void>>;
}
