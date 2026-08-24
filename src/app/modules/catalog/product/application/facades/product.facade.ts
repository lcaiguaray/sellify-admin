import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ApiResponse, PageMetadata } from '@core/shared-kernel/models/api-response.model';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import {
  CreateProduct,
  Product,
  ProductSearchable,
  ProductSearchableDefault,
} from '../../domain/models/product.model';
import { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable({ providedIn: 'root' })
export class ProductFacade {
  private readonly repository = inject(ProductRepository);

  readonly selected = signal<Product | null>(null);
  readonly filters = signal<ProductSearchable>(ProductSearchableDefault);
  readonly processingIds = signal<Set<string>>(new Set<string>());

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

  readonly pagination = computed<PageMetadata>(() => {
    if (this.resource.error()) {
      return { pageNumber: 0, pageSize: 10, totalElements: 0, totalPages: 0, isLast: true };
    }

    const data = this.resource.value()?.data;
    return {
      pageNumber: data?.pageNumber ?? 0,
      pageSize: data?.pageSize ?? 10,
      totalElements: data?.totalElements ?? 0,
      totalPages: data?.totalPages ?? 0,
      isLast: data?.isLast ?? true,
    };
  });

  load(): void {
    this.filters.set(ProductSearchableDefault);
  }

  updateFilters(newFilters: Partial<ProductSearchable>): void {
    this.filters.update((current) => ({ ...current, ...newFilters, page: 0 }));
  }

  changePage(page: number): void {
    if (page < 0 || page >= Math.max(this.pagination().totalPages, 1)) return;
    this.filters.update((current) => ({ ...current, page }));
  }

  changePageSize(size: number): void {
    if (size <= 0) return;
    this.filters.update((current) => ({ ...current, size, page: 0 }));
  }

  async findById(id: Product['id']): Promise<ApiResponse<Product>> {
    return firstValueFrom(this.repository.findById(id));
  }

  async create(payload: CreateProduct): Promise<ApiResponse<Product>> {
    const response = await firstValueFrom(this.repository.create(payload));
    this.resource.reload();
    return response;
  }

  async update(product: Product): Promise<ApiResponse<Product>> {
    const response = await firstValueFrom(this.repository.update(product));
    this.replaceProduct(response.data);
    return response;
  }

  async enable(id: Product['id']): Promise<ApiResponse<void>> {
    return this.setStatus(id, true);
  }

  async disable(id: Product['id']): Promise<ApiResponse<void>> {
    return this.setStatus(id, false);
  }

  private async setStatus(id: Product['id'], active: boolean): Promise<ApiResponse<void>> {
    this.setProcessing(id, true);
    try {
      const response = await firstValueFrom(
        active ? this.repository.enable(id) : this.repository.disable(id),
      );
      this.updateStatus(id, active);
      return response;
    } finally {
      this.setProcessing(id, false);
    }
  }

  private replaceProduct(product: Product): void {
    this.resource.value.update((current) =>
      current
        ? {
            ...current,
            data: {
              ...current.data,
              content: current.data.content.map((item) =>
                item.id === product.id ? product : item,
              ),
            },
          }
        : current,
    );
  }

  private updateStatus(id: Product['id'], active: boolean): void {
    this.resource.value.update((current) =>
      current
        ? {
            ...current,
            data: {
              ...current.data,
              content: current.data.content.map((item) =>
                item.id === id ? { ...item, active } : item,
              ),
            },
          }
        : current,
    );
  }

  private setProcessing(id: string, processing: boolean): void {
    this.processingIds.update((current) => {
      const next = new Set(current);
      processing ? next.add(id) : next.delete(id);
      return next;
    });
  }
}
