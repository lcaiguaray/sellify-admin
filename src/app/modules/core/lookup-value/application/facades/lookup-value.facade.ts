import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, firstValueFrom, of } from 'rxjs';
import { ApiPageResponse, ApiResponse, PageMetadata } from '@core/shared-kernel/models/api-response.model';
import {
  CreateLookupValue,
  createLookupValueSearchable,
  LookupValue,
  LookupValueSearchable,
} from '../../domain/models/lookup-value.model';
import { LookupValueRepository } from '../../domain/repositories/lookup-value.repository';

@Injectable({ providedIn: 'root' })
export class LookupValueFacade {
  private readonly repository = inject(LookupValueRepository);
  readonly filters = signal<LookupValueSearchable>(createLookupValueSearchable(''));
  readonly processingIds = signal<Set<string>>(new Set());
  private readonly debouncedFilters = toSignal(
    toObservable(this.filters).pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    ),
    { initialValue: undefined },
  );
  readonly resource = rxResource<ApiPageResponse<LookupValue>, LookupValueSearchable>({
    params: () => this.debouncedFilters() ?? createLookupValueSearchable(''),
    stream: ({ params }) => {
      if (!params.lookupGroupId) {
        return of<ApiPageResponse<LookupValue>>({
          status: 200,
          message: '',
          data: {
            content: [],
            pageNumber: 0,
            pageSize: params.size,
            totalElements: 0,
            totalPages: 0,
            isLast: true,
          },
        });
      }
      return this.repository.get(params);
    },
  });
  readonly data = computed(() => (this.resource.error() ? [] : this.resource.value()?.data.content ?? []));
  readonly isLoading = computed(() => this.resource.isLoading());
  readonly error = computed(() => this.resource.error());
  readonly pagination = computed<PageMetadata>(() => {
    const data = this.resource.value()?.data;
    return {
      pageNumber: data?.pageNumber ?? 0,
      pageSize: data?.pageSize ?? 10,
      totalElements: data?.totalElements ?? 0,
      totalPages: data?.totalPages ?? 0,
      isLast: data?.isLast ?? true,
    };
  });

  load(lookupGroupId: string): void { this.filters.set(createLookupValueSearchable(lookupGroupId)); }
  updateFilters(filters: Partial<LookupValueSearchable>): void {
    this.filters.update((current) => ({ ...current, ...filters, page: 0 }));
  }
  changePage(page: number): void {
    if (page >= 0 && page < Math.max(this.pagination().totalPages, 1)) this.filters.update((current) => ({ ...current, page }));
  }
  changePageSize(size: number): void {
    if (size > 0) this.filters.update((current) => ({ ...current, size, page: 0 }));
  }

  async create(payload: CreateLookupValue): Promise<ApiResponse<LookupValue>> {
    const response = await firstValueFrom(this.repository.create(payload));
    this.resource.value.update((current) =>
      current ? { ...current, data: { ...current.data, content: [response.data, ...current.data.content] } } : current,
    );
    return response;
  }

  async enable(id: string): Promise<ApiResponse<void>> { return this.toggle(id, true); }
  async disable(id: string): Promise<ApiResponse<void>> { return this.toggle(id, false); }

  private async toggle(id: string, active: boolean): Promise<ApiResponse<void>> {
    this.setProcessing(id, true);
    try {
      const response = await firstValueFrom(active ? this.repository.enable(id) : this.repository.disable(id));
      this.resource.value.update((current) =>
        current
          ? { ...current, data: { ...current.data, content: current.data.content.map((item) => item.id === id ? { ...item, active } : item) } }
          : current,
      );
      return response;
    } finally {
      this.setProcessing(id, false);
    }
  }

  private setProcessing(id: string, processing: boolean): void {
    this.processingIds.update((current) => {
      const next = new Set(current);
      processing ? next.add(id) : next.delete(id);
      return next;
    });
  }
}
