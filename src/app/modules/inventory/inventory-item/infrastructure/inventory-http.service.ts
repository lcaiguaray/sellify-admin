import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/services/base-api.service';
import { map, Observable } from 'rxjs';
import { InventoryRepository } from './../domain/repositories/inventory.repository';
import { InventoryItem, InventorySearchable, CreateInventoryItem } from './../domain/models/inventory.model';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';
import { InventoryApiDto } from './dtos/inventory-api.dto';
import { InventoryMapper } from './mappers/inventory.mapper';

@Injectable({ providedIn: 'root' })
export class InventoryHttpService extends BaseApiService implements InventoryRepository {
  private readonly resource = '/inventory/items';

  get(searchable: InventorySearchable): Observable<ApiPageResponse<InventoryItem>> {
    const params = this.buildParams(searchable);

    const url = this.buildUrl(this.resource);
    return this.http.get<ApiPageResponse<InventoryApiDto>>(url, { params }).pipe(
      map((response) => {
        const data = response.data.content.map(InventoryMapper.fromDto);
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

  create(payload: CreateInventoryItem): Observable<ApiResponse<InventoryItem>> {
    const url = this.buildUrl(`${this.resource}`);
    return this.http.post<ApiResponse<InventoryApiDto>>(url, payload).pipe(
      map((response) => ({
        ...response,
        data: InventoryMapper.fromDto(response.data),
      })),
    );
  }

  update(item: InventoryItem): Observable<ApiResponse<InventoryItem>> {
    const url = this.buildUrl(`${this.resource}/${item.id}`);
    return this.http.put<ApiResponse<InventoryApiDto>>(url, item).pipe(
      map((response) => ({
        ...response,
        data: InventoryMapper.fromDto(response.data),
      })),
    );
  }

  enable(id: InventoryItem['id']): Observable<ApiResponse<void>> {
    const url = this.buildUrl(`${this.resource}/${id}/enable`);
    return this.http.put<ApiResponse<void>>(url, {});
  }

  disable(id: InventoryItem['id']): Observable<ApiResponse<void>> {
    const url = this.buildUrl(`${this.resource}/${id}/disable`);
    return this.http.put<ApiResponse<void>>(url, {});
  }

  fractionate(payload: { inventoryItemId: string; quantity: number; toUnitId: string; factor: number; toUnitName: string; }): Observable<ApiResponse<void>> {
    const url = this.buildUrl(`${this.resource}/${payload.inventoryItemId}/fractionate`);
    return this.http.post<ApiResponse<void>>(url, payload);
  }
}
