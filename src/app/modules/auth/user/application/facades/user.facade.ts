import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { ApiResponse, PageMetadata } from '@core/shared-kernel/models/api-response.model';
import { CreateUser, User, UserSearchable, UserSearchableDefault } from '../../domain/models/user.model';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable({ providedIn: 'root' })
export class UserFacade {
  private readonly repository = inject(UserRepository);
  readonly filters = signal<UserSearchable>(UserSearchableDefault);
  readonly processingIds = signal<Set<string>>(new Set());
  private readonly debouncedFilters = toSignal(
    toObservable(this.filters).pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    ),
    { initialValue: undefined },
  );
  readonly resource = rxResource({ params: () => this.debouncedFilters(), stream: ({ params }) => this.repository.get(params) });
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

  load(): void { this.filters.set({ ...UserSearchableDefault }); }
  updateFilters(filters: Partial<UserSearchable>): void {
    this.filters.update((current) => ({ ...current, ...filters, page: 0 }));
  }
  changePage(page: number): void {
    if (page >= 0 && page < Math.max(this.pagination().totalPages, 1)) this.filters.update((current) => ({ ...current, page }));
  }
  changePageSize(size: number): void {
    if (size > 0) this.filters.update((current) => ({ ...current, size, page: 0 }));
  }

  async create(payload: CreateUser): Promise<ApiResponse<User>> {
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
          ? { ...current, data: { ...current.data, content: current.data.content.map((user) => user.id === id ? { ...user, active } : user) } }
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
