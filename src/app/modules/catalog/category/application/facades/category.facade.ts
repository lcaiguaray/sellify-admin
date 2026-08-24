import { Injectable, inject, signal, computed } from '@angular/core';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { CategoryRepository } from '../../domain/repositories/category.repository';
import {
  Category,
  CategorySearchable,
  CategorySearchableDefault,
  CreateCategory,
} from '../../domain/models/category.model';
import { ApiResponse, PageMetadata } from '@core/shared-kernel/models/api-response.model';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class CategoryFacade {
  private readonly repository = inject(CategoryRepository);

  readonly selected = signal<Category | null>(null);
  readonly filters = signal<CategorySearchable>(CategorySearchableDefault);

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
    this.filters.set(CategorySearchableDefault);
  }

  updateFilters(newFilters: Partial<CategorySearchable>) {
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

  async create(payload: CreateCategory): Promise<ApiResponse<Category>> {
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

  async update(category: Category): Promise<ApiResponse<Category>> {
    try {
      const response = await firstValueFrom(this.repository.update(category));
      this.resource.value.update((current) => {
        if (!current) return current;
        return {
          ...current,
          data: {
            ...current.data,
            content: current.data.content.map((c) => (c.id === category.id ? response.data : c)),
          },
        };
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  async enable(id: Category['id']): Promise<ApiResponse<void>> {
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

  async disable(id: Category['id']): Promise<ApiResponse<void>> {
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

  private updateStatus(id: Category['id'], active: boolean) {
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
