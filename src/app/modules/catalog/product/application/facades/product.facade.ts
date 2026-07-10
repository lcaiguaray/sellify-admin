import { Injectable, inject, signal, computed } from '@angular/core';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { ProductRepository } from '../../domain/repositories/product.repository';
import {
  Product,
  ProductSearchable,
  ProductSearchableDefault,
  CreateProduct,
} from '../../domain/models/product.model';
import { ApiResponse, PageMetadata } from '@core/shared-kernel/models/api-response.model';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class ProductFacade {
  private readonly repository = inject(ProductRepository);

  readonly selected = signal<Product | null>(null);
  readonly filters = signal<ProductSearchable | undefined>(undefined);

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
    this.filters.set(ProductSearchableDefault);
  }

  updateFilters(newFilters: Partial<ProductSearchable>) {
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

  async create(payload: CreateProduct): Promise<ApiResponse<Product>> {
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

  async update(product: Product): Promise<ApiResponse<Product>> {
    try {
      const response = await firstValueFrom(this.repository.update(product));
      this.resource.value.update((current) => {
        if (!current) return current;
        return {
          ...current,
          data: {
            ...current.data,
            content: current.data.content.map((p) => (p.id === product.id ? response.data : p)),
          },
        };
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  async enable(id: Product['id']) {
    try {
      await firstValueFrom(this.repository.enable(id));
      this.updateStatus(id, true);
    } catch (err) {}
  }

  async disable(id: Product['id']) {
    try {
      await firstValueFrom(this.repository.disable(id));
      this.updateStatus(id, false);
    } catch (err) {}
  }

  private updateStatus(id: Product['id'], active: boolean) {
    this.resource.value.update((current) => {
      if (!current) return current;
      return {
        ...current,
        data: {
          ...current.data,
          content: current.data.content.map((p) => (p.id === id ? { ...p, active } : p)),
        },
      };
    });
  }
}
