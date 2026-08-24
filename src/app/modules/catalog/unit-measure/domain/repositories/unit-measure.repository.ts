import { Observable } from 'rxjs';
import { UnitMeasure, UnitMeasureSearchable, CreateUnitMeasure } from '../models/unit-measure.model';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';

export abstract class UnitMeasureRepository {
  abstract get(searchable: UnitMeasureSearchable): Observable<ApiPageResponse<UnitMeasure>>;
  abstract create(payload: CreateUnitMeasure): Observable<ApiResponse<UnitMeasure>>;
  abstract update(unitMeasure: UnitMeasure): Observable<ApiResponse<UnitMeasure>>;
  abstract enable(id: UnitMeasure['id']): Observable<ApiResponse<void>>;
  abstract disable(id: UnitMeasure['id']): Observable<ApiResponse<void>>;
}
