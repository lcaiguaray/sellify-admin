import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PageMetadata } from '@core/shared-kernel/models/api-response.model';
import { LookupGroupSearchable, LookupGroupSearchableDefault } from '../../domain/models/lookup-group.model';
import { LookupGroupRepository } from '../../domain/repositories/lookup-group.repository';

@Injectable({ providedIn: 'root' })
export class LookupGroupFacade {
  private readonly repository = inject(LookupGroupRepository);
  readonly filters = signal<LookupGroupSearchable>(LookupGroupSearchableDefault);
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

  load(): void { this.filters.set({ ...LookupGroupSearchableDefault }); }
  updateFilters(filters: Partial<LookupGroupSearchable>): void {
    this.filters.update((current) => ({ ...current, ...filters, page: 0 }));
  }
  changePage(page: number): void {
    if (page >= 0 && page < Math.max(this.pagination().totalPages, 1)) this.filters.update((current) => ({ ...current, page }));
  }
  changePageSize(size: number): void {
    if (size > 0) this.filters.update((current) => ({ ...current, size, page: 0 }));
  }
}
