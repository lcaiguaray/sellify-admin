import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { ApiResponse, PageMetadata } from '@core/shared-kernel/models/api-response.model';
import { CreateRole, Role, RoleSearchable, RoleSearchableDefault } from '../../domain/models/role.model';
import { RoleRepository } from '../../domain/repositories/role.repository';

@Injectable({ providedIn: 'root' })
export class RoleFacade {
  private readonly repository = inject(RoleRepository);
  readonly filters = signal<RoleSearchable>(RoleSearchableDefault);
  readonly processingIds = signal<Set<string>>(new Set());

  private readonly debouncedFilters = toSignal(
    toObservable(this.filters).pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    ),
    { initialValue: undefined },
  );

  readonly resource = rxResource({
    params: () => this.debouncedFilters(),
    stream: ({ params }) => this.repository.get(params),
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

  load(): void {
    this.filters.set({ ...RoleSearchableDefault });
  }

  updateFilters(filters: Partial<RoleSearchable>): void {
    this.filters.update((current) => ({ ...current, ...filters, page: 0 }));
  }

  changePage(page: number): void {
    if (page >= 0 && page < Math.max(this.pagination().totalPages, 1)) {
      this.filters.update((current) => ({ ...current, page }));
    }
  }

  changePageSize(size: number): void {
    if (size > 0) this.filters.update((current) => ({ ...current, size, page: 0 }));
  }

  async create(payload: CreateRole): Promise<ApiResponse<Role>> {
    const response = await firstValueFrom(this.repository.create(payload));
    this.prepend(response.data);
    return response;
  }

  async update(role: Role): Promise<ApiResponse<Role>> {
    const response = await firstValueFrom(this.repository.update(role));
    this.replace(response.data);
    return response;
  }

  async enable(id: string): Promise<ApiResponse<void>> {
    return this.toggle(id, true);
  }

  async disable(id: string): Promise<ApiResponse<void>> {
    return this.toggle(id, false);
  }

  private async toggle(id: string, active: boolean): Promise<ApiResponse<void>> {
    this.setProcessing(id, true);
    try {
      const response = await firstValueFrom(active ? this.repository.enable(id) : this.repository.disable(id));
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
      return response;
    } finally {
      this.setProcessing(id, false);
    }
  }

  private prepend(role: Role): void {
    this.resource.value.update((current) =>
      current ? { ...current, data: { ...current.data, content: [role, ...current.data.content] } } : current,
    );
  }

  private replace(role: Role): void {
    this.resource.value.update((current) =>
      current
        ? {
            ...current,
            data: {
              ...current.data,
              content: current.data.content.map((item) => (item.id === role.id ? role : item)),
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
