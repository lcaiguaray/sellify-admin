import { Injectable, inject, signal, computed } from '@angular/core';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { InventoryRepository } from '../../domain/repositories/inventory.repository';
import {
  InventoryItem,
  InventorySearchable,
  InventorySearchableDefault,
  CreateInventoryItem,
} from '../../domain/models/inventory.model';
import { ApiResponse, PageMetadata } from '@core/shared-kernel/models/api-response.model';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class InventoryFacade {
  private readonly repository = inject(InventoryRepository);

  readonly selected = signal<InventoryItem | null>(null);
  readonly filters = signal<InventorySearchable | undefined>(undefined);

  private readonly debouncedFilters = toSignal(
    toObservable(this.filters).pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
    ),
  );

  readonly resource = rxResource({
    params: () => this.debouncedFilters(),
    stream: ({ params }) => this.repository.get(params),
  });

  readonly data = computed(() => this.resource.value()?.data.content ?? []);
  readonly isLoading = computed(() => this.resource.isLoading());
  readonly hasData = computed(() => this.data().length > 0);

  readonly pagination = computed<PageMetadata>(() => {
    const responseData = this.resource.value()?.data;
    if (responseData) {
      return {
        pageNumber: responseData.pageNumber,
        pageSize: responseData.pageSize,
        totalElements: responseData.totalElements,
        totalPages: responseData.totalPages,
        isLast: responseData.isLast,
      };
    }
    return {
      pageNumber: 0,
      pageSize: 10,
      totalElements: 0,
      totalPages: 0,
      isLast: true,
    };
  });

  load() {
    this.filters.set(InventorySearchableDefault);
  }

  updateFilters(newFilters: Partial<InventorySearchable>) {
    this.filters.update((current) =>
      current ? { ...current, ...newFilters, page: 0 } : undefined,
    );
  }

  changePage(page: number) {
    if (page < 0 || page > this.pagination().totalPages) return;
    this.filters.update((current) => (current ? { ...current, page } : undefined));
  }

  changePageSize(pageSize: number) {
    if (pageSize < 0) return;
    this.filters.update((current) =>
      current ? { ...current, size: pageSize, page: 0 } : undefined,
    );
  }

  async create(payload: CreateInventoryItem): Promise<ApiResponse<InventoryItem>> {
    try {
      const response = await firstValueFrom(this.repository.create(payload));
      this.resource.value.update((current) => {
        if (!current) return current;
        return {
          ...current,
          data: {
            ...current.data,
            content: [response.data, ...current.data.content],
          },
        };
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  async update(item: InventoryItem): Promise<ApiResponse<InventoryItem>> {
    try {
      const response = await firstValueFrom(this.repository.update(item));
      this.resource.value.update((current) => {
        if (!current) return current;
        return {
          ...current,
          data: {
            ...current.data,
            content: current.data.content.map((i) => (i.id === item.id ? response.data : i)),
          },
        };
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  async enable(id: InventoryItem['id']) {
    try {
      await firstValueFrom(this.repository.enable(id));
      this.updateStatus(id, true);
    } catch (err) {}
  }

  async disable(id: InventoryItem['id']) {
    try {
      await firstValueFrom(this.repository.disable(id));
      this.updateStatus(id, false);
    } catch (err) {}
  }

  private updateStatus(id: InventoryItem['id'], active: boolean) {
    this.resource.value.update((current) => {
      if (!current) return current;
      return {
        ...current,
        data: {
          ...current.data,
          content: current.data.content.map((i) => (i.id === id ? { ...i, active } : i)),
        },
      };
    });
  }

  async fractionate(payload: { inventoryItemId: string; quantity: number; toUnitId: string; factor: number; toUnitName: string; }): Promise<ApiResponse<void>> {
    try {
      const response = await firstValueFrom(this.repository.fractionate(payload));
      // Reload inventory list after fractionating to get the new stock rows
      this.resource.reload();
      return response;
    } catch (err) {
      throw err;
    }
  }
}
