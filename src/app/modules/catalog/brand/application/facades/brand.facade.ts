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
  readonly filters = signal<BrandSearchable | undefined>(undefined);

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
    this.filters.set(BrandSearchableDefault);
  }

  updateFilters(newFilters: Partial<BrandSearchable>) {
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

  async enable(id: Brand['id']) {
    try {
      await firstValueFrom(this.repository.enable(id));
      this.updateStatus(id, true);
    } catch (err) {}
  }

  async disable(id: Brand['id']) {
    try {
      await firstValueFrom(this.repository.disable(id));
      this.updateStatus(id, false);
    } catch (err) {}
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
}
