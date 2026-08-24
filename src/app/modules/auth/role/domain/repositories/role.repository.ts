import { Observable } from 'rxjs';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';
import { CreateRole, Role, RoleSearchable } from '../models/role.model';

export abstract class RoleRepository {
  abstract get(searchable: RoleSearchable): Observable<ApiPageResponse<Role>>;
  abstract findById(id: Role['id']): Observable<ApiResponse<Role>>;
  abstract create(payload: CreateRole): Observable<ApiResponse<Role>>;
  abstract update(role: Role): Observable<ApiResponse<Role>>;
  abstract enable(id: Role['id']): Observable<ApiResponse<void>>;
  abstract disable(id: Role['id']): Observable<ApiResponse<void>>;
  abstract replacePermissions(id: Role['id'], permissionIds: string[]): Observable<ApiResponse<void>>;
}
