import { Injectable, inject, signal, computed } from '@angular/core';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { BrandRepository } from '../../domain/repositories/brand.repository';
import {
  Brand,
  BrandSearchable,
  BrandSearchableDefault,
  CreateBrand,
} from '../../domain/models/brand.model';
import { ApiResponse, PageMetadata } from '@core/shared-kernel/models/api-response.model';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class BrandFacade {
  private readonly repository = inject(BrandRepository);

  readonly selected = signal<Brand | null>(null);
  readonly filters = signal<BrandSearchable>(BrandSearchableDefault);

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
    this.filters.set(BrandSearchableDefault);
  }

  updateFilters(newFilters: Partial<BrandSearchable>) {
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

  async create(payload: CreateBrand): Promise<ApiResponse<Brand>> {
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

  async update(brand: Brand): Promise<ApiResponse<Brand>> {
    try {
      const response = await firstValueFrom(this.repository.update(brand));
      this.resource.value.update((current) => {
        if (!current) return current;
        return {
          ...current,
          data: {
            ...current.data,
            content: current.data.content.map((b) => (b.id === brand.id ? response.data : b)),
          },
        };
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  async enable(id: Brand['id']): Promise<ApiResponse<void>> {
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

  async disable(id: Brand['id']): Promise<ApiResponse<void>> {
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

  private updateStatus(id: Brand['id'], active: boolean) {
    this.resource.value.update((current) => {
      if (!current) return current;
      return {
        ...current,
        data: {
          ...current.data,
          content: current.data.content.map((b) => (b.id === id ? { ...b, active } : b)),
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
