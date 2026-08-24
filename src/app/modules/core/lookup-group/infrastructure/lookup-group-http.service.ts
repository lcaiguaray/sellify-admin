import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseApiService } from '@core/services/base-api.service';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';
import { LookupGroup, LookupGroupSearchable } from '../domain/models/lookup-group.model';
import { LookupGroupRepository } from '../domain/repositories/lookup-group.repository';
import { LookupGroupApiDto } from './dtos/lookup-group-api.dto';
import { LookupGroupMapper } from './mappers/lookup-group.mapper';

@Injectable({ providedIn: 'root' })
export class LookupGroupHttpService extends BaseApiService implements LookupGroupRepository {
  private readonly resource = '/core/lookup-groups';

  get(searchable: LookupGroupSearchable): Observable<ApiPageResponse<LookupGroup>> {
    return this.http
      .get<ApiPageResponse<LookupGroupApiDto>>(this.buildUrl(this.resource), {
        params: this.buildParams(searchable),
      })
      .pipe(
        map((response) => ({
          ...response,
          data: {
            ...response.data,
            content: response.data.content.map((item) => LookupGroupMapper.fromDto(item)!),
          },
        })),
      );
  }

  findById(id: string): Observable<ApiResponse<LookupGroup>> {
    return this.http
      .get<ApiResponse<LookupGroupApiDto>>(this.buildUrl(`${this.resource}/${id}`))
      .pipe(map((response) => ({ ...response, data: LookupGroupMapper.fromDto(response.data)! })));
  }
}
