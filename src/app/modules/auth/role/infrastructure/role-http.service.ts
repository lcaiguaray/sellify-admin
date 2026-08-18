import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseApiService } from '@core/services/base-api.service';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';
import { CreateRole, Role, RoleSearchable } from '../domain/models/role.model';
import { RoleRepository } from '../domain/repositories/role.repository';
import { RoleApiDto } from './dtos/role-api.dto';
import { RoleMapper } from './mappers/role.mapper';

@Injectable({ providedIn: 'root' })
export class RoleHttpService extends BaseApiService implements RoleRepository {
  private readonly resource = '/auth/roles';

  get(searchable: RoleSearchable): Observable<ApiPageResponse<Role>> {
    return this.http
      .get<ApiPageResponse<RoleApiDto>>(this.buildUrl(this.resource), {
        params: this.buildParams(searchable),
      })
      .pipe(
        map((response) => ({
          ...response,
          data: {
            ...response.data,
            content: response.data.content.map((item) => RoleMapper.fromDto(item)!),
          },
        })),
      );
  }

  findById(id: string): Observable<ApiResponse<Role>> {
    return this.mapResponse(
      this.http.get<ApiResponse<RoleApiDto>>(this.buildUrl(`${this.resource}/${id}`)),
    );
  }

  create(payload: CreateRole): Observable<ApiResponse<Role>> {
    return this.mapResponse(
      this.http.post<ApiResponse<RoleApiDto>>(this.buildUrl(this.resource), payload),
    );
  }

  update(role: Role): Observable<ApiResponse<Role>> {
    return this.mapResponse(
      this.http.put<ApiResponse<RoleApiDto>>(this.buildUrl(`${this.resource}/${role.id}`), {
        name: role.name,
        description: role.description,
      }),
    );
  }

  enable(id: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(this.buildUrl(`${this.resource}/${id}/enable`), {});
  }

  disable(id: string): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(this.buildUrl(`${this.resource}/${id}/disable`), {});
  }

  replacePermissions(id: string, permissionIds: string[]): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(this.buildUrl(`${this.resource}/${id}/permissions`), {
      permissionIds,
    });
  }

  private mapResponse(source: Observable<ApiResponse<RoleApiDto>>): Observable<ApiResponse<Role>> {
    return source.pipe(
      map((response) => ({ ...response, data: RoleMapper.fromDto(response.data)! })),
    );
  }
}
