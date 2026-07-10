import { Injectable, inject, signal, computed } from '@angular/core';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { UnitConversionRepository } from '../../domain/repositories/unit-conversion.repository';
import {
  UnitConversion,
  UnitConversionSearchable,
  UnitConversionSearchableDefault,
  CreateUnitConversion,
} from '../../domain/models/unit-conversion.model';
import { ApiResponse, PageMetadata } from '@core/shared-kernel/models/api-response.model';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class UnitConversionFacade {
  private readonly repository = inject(UnitConversionRepository);

  readonly selected = signal<UnitConversion | null>(null);
  readonly filters = signal<UnitConversionSearchable>(UnitConversionSearchableDefault);

  private readonly debouncedFilters = toSignal(
    toObservable(this.filters).pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
    ),
    { initialValue: undefined },
  );

  readonly resource = rxResource({
    params: () => this.debouncedFilters(),
    stream: ({ params }) => this.repository.get(params),
  });

  readonly data = computed(() => {
    if (this.resource.error()) return [];
    return this.resource.value()?.data.content ?? [];
  });
  readonly isLoading = computed(() => this.resource.isLoading());
  readonly hasData = computed(() => this.data().length > 0);
  readonly error = computed(() => this.resource.error());
  readonly processingIds = signal<Set<string>>(new Set<string>());

  readonly pagination = computed<PageMetadata>(() => {
    if (this.resource.error()) {
      return { pageNumber: 0, pageSize: 10, totalElements: 0, totalPages: 0, isLast: true };
    }

    const responseData = this.resource.value()?.data;
    return {
      pageNumber: responseData?.pageNumber ?? 0,
      pageSize: responseData?.pageSize ?? 10,
      totalElements: responseData?.totalElements ?? 0,
      totalPages: responseData?.totalPages ?? 0,
      isLast: responseData?.isLast ?? true,
    };
  });

  load() {
    this.filters.set(UnitConversionSearchableDefault);
  }

  updateFilters(newFilters: Partial<UnitConversionSearchable>) {
    this.filters.update((current) => ({ ...current, ...newFilters, page: 0 }));
  }

  changePage(page: number) {
    if (page < 0 || page > this.pagination().totalPages) return;
    this.filters.update((current) => ({ ...current, page }));
  }

  changePageSize(pageSize: number) {
    if (pageSize < 0) return;
    this.filters.update((current) => ({ ...current, size: pageSize, page: 0 }));
  }

  async create(payload: CreateUnitConversion): Promise<ApiResponse<UnitConversion>> {
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

  async update(unitConversion: UnitConversion): Promise<ApiResponse<UnitConversion>> {
    try {
      const response = await firstValueFrom(this.repository.update(unitConversion));
      this.resource.value.update((current) => {
        if (!current) return current;
        return {
          ...current,
          data: {
            ...current.data,
            content: current.data.content.map((c) =>
              c.id === unitConversion.id ? response.data : c,
            ),
          },
        };
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  async enable(id: UnitConversion['id']): Promise<ApiResponse<void>> {
    this.setProcessing(id, true);
    try {
      const response = await firstValueFrom(this.repository.enable(id));
      this.updateStatus(id, true);
      this.setProcessing(id, false);
      return response;
    } catch (err) {
      this.setProcessing(id, false);
      throw err;
    }
  }

  async disable(id: UnitConversion['id']): Promise<ApiResponse<void>> {
    this.setProcessing(id, true);
    try {
      const response = await firstValueFrom(this.repository.disable(id));
      this.updateStatus(id, false);
      this.setProcessing(id, false);
      return response;
    } catch (err) {
      this.setProcessing(id, false);
      throw err;
    }
  }

  private updateStatus(id: UnitConversion['id'], active: boolean) {
    this.resource.value.update((current) => {
      if (!current) return current;
      return {
        ...current,
        data: {
          ...current.data,
          content: current.data.content.map((c) => (c.id === id ? { ...c, active } : c)),
        },
      };
    });
  }

  private setProcessing(id: string, isProcessing: boolean) {
    this.processingIds.update((currentSet) => {
      const newSet = new Set(currentSet);
      isProcessing ? newSet.add(id) : newSet.delete(id);
      return newSet;
    });
  }
}
