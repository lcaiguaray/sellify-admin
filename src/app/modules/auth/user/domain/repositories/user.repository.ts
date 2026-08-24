import { Observable } from 'rxjs';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';
import { CreateUser, User, UserSearchable } from '../models/user.model';

export abstract class UserRepository {
  abstract get(searchable: UserSearchable): Observable<ApiPageResponse<User>>;
  abstract create(payload: CreateUser): Observable<ApiResponse<User>>;
  abstract enable(id: User['id']): Observable<ApiResponse<void>>;
  abstract disable(id: User['id']): Observable<ApiResponse<void>>;
}
