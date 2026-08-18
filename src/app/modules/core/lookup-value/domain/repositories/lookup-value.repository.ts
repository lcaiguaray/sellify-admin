import { Observable } from 'rxjs';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';
import { CreateLookupValue, LookupValue, LookupValueSearchable } from '../models/lookup-value.model';

export abstract class LookupValueRepository {
  abstract get(searchable: LookupValueSearchable): Observable<ApiPageResponse<LookupValue>>;
  abstract findById(id: LookupValue['id']): Observable<ApiResponse<LookupValue>>;
  abstract create(payload: CreateLookupValue): Observable<ApiResponse<LookupValue>>;
  abstract enable(id: LookupValue['id']): Observable<ApiResponse<void>>;
  abstract disable(id: LookupValue['id']): Observable<ApiResponse<void>>;
}
