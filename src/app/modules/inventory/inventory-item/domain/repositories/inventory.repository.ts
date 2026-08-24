import { Observable } from 'rxjs';
import { InventoryItem, InventorySearchable, CreateInventoryItem } from '../models/inventory.model';
import { ApiPageResponse, ApiResponse } from '@core/shared-kernel/models/api-response.model';

export abstract class InventoryRepository {
  abstract get(searchable: InventorySearchable): Observable<ApiPageResponse<InventoryItem>>;
  abstract create(payload: CreateInventoryItem): Observable<ApiResponse<InventoryItem>>;
  abstract update(item: InventoryItem): Observable<ApiResponse<InventoryItem>>;
  abstract enable(id: InventoryItem['id']): Observable<ApiResponse<void>>;
  abstract disable(id: InventoryItem['id']): Observable<ApiResponse<void>>;
  abstract fractionate(payload: { inventoryItemId: string; quantity: number; toUnitId: string; factor: number; toUnitName: string; }): Observable<ApiResponse<void>>;
}
