import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseApiService } from '@core/services/base-api.service';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';
import { CreateUser, User, UserSearchable } from '../domain/models/user.model';
import { UserRepository } from '../domain/repositories/user.repository';
import { UserApiDto } from './dtos/user-api.dto';
import { UserMapper } from './mappers/user.mapper';

@Injectable({ providedIn: 'root' })
export class UserHttpService extends BaseApiService implements UserRepository {
  private readonly resource = '/auth/users';

  get(searchable: UserSearchable): Observable<ApiPageResponse<User>> {
    return this.http
      .get<ApiPageResponse<UserApiDto>>(this.buildUrl(this.resource), {
        params: this.buildParams(searchable),
      })
      .pipe(
        map((response) => ({
          ...response,
          data: {
            ...response.data,
            content: response.data.content.map((item) => UserMapper.fromDto(item)!),
          },
        })),
      );
  }

  create(payload: CreateUser): Observable<ApiResponse<User>> {
    return this.http
      .post<ApiResponse<UserApiDto>>(this.buildUrl(this.resource), payload)
      .pipe(map((response) => ({ ...response, data: UserMapper.fromDto(response.data)! })));
  }

  enable(id: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(this.buildUrl(`${this.resource}/${id}/enable`), {});
  }

  disable(id: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(this.buildUrl(`${this.resource}/${id}/disable`), {});
  }
}
