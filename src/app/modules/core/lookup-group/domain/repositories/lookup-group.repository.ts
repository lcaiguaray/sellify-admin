import { Observable } from 'rxjs';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';
import { LookupGroup, LookupGroupSearchable } from '../models/lookup-group.model';

export abstract class LookupGroupRepository {
  abstract get(searchable: LookupGroupSearchable): Observable<ApiPageResponse<LookupGroup>>;
  abstract findById(id: string): Observable<ApiResponse<LookupGroup>>;
}
