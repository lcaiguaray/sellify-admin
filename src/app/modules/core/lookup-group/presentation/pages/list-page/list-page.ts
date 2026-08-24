import { Component, computed, inject, OnInit, TemplateRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeArrowRight01, hugeDownload03 } from '@ng-icons/huge-icons';
import { mapHttpErrorToUiState } from '@core/utils/http-error.util';
import { DataTableComponent } from '@ui/data-table/data-table';
import { TableColumn } from '@ui/data-table/data-table.model';
import { ListToolbar } from '@ui/list-toolbar';
import { PageHeader } from '@ui/page-header';
import { Pagination } from '@ui/pagination';
import StatusBadge from '@ui/status-badge';
import TableRowSkeleton from '@ui/table-row-skeleton';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmCardImports } from '@ui-spartan/card';
import { HlmTableImports } from '@ui-spartan/table';
import { LookupGroupFacade } from '../../../application/facades/lookup-group.facade';
import { LookupGroup } from '../../../domain/models/lookup-group.model';
import { AuthFacade } from '@modules/auth';

@Component({
  selector: 'app-lookup-group-list-page',
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    HlmButtonImports,
    HlmCardImports,
    HlmTableImports,
    DataTableComponent,
    ListToolbar,
    PageHeader,
    Pagination,
    StatusBadge,
    TableRowSkeleton,
  ],
  providers: [provideIcons({ hugeArrowRight01, hugeDownload03 })],
  template: `
    <app-page-header
      class="mb-4"
      title="Catálogos del sistema"
      description="Consulte los grupos y administre sus valores"
      [actionLabel]="''"
    />

    <app-list-toolbar class="mb-4" [searchTerm]="filters().search" (searchChange)="search($event)">
      <button hlmBtn variant="outline"><ng-icon name="hugeDownload03" /> Exportar</button>
    </app-list-toolbar>

    <hlm-card size="sm" class="mb-4 w-full p-0">
      <div hlmCardContent class="p-0">
        @if (isLoading()) {
          <div hlmTableContainer><app-table-row-skeleton [rows]="5" [columns]="4" /></div>
        } @else {
          <app-data-table [data]="groups()" [columns]="columns()" [error]="uiError()" />
        }
      </div>
    </hlm-card>

    <ng-template #nameCell let-group>
      <div class="flex flex-col">
        <span class="font-medium">{{ group.name }}</span>
        <span class="font-mono text-xs text-muted-foreground">{{ group.id }}</span>
      </div>
    </ng-template>
    <ng-template #statusCell let-group><app-status-badge [status]="group.active" /></ng-template>
    <ng-template #actionsCell let-group>
      <a hlmBtn variant="outline" size="sm" [routerLink]="[group.id, 'values']">
        Ver valores <ng-icon name="hugeArrowRight01" />
      </a>
    </ng-template>

    <app-pagination
      [pageSize]="pagination().pageSize"
      [currentPage]="pagination().pageNumber + 1"
      [totalPages]="pagination().totalPages"
      (pageChanged)="facade.changePage($event - 1)"
      (pageSizeChanged)="facade.changePageSize($event)"
    />
  `,
})
export default class LookupGroupListPage implements OnInit {
  protected readonly facade = inject(LookupGroupFacade);
  private readonly auth = inject(AuthFacade);
  readonly canViewValues = computed(() => this.auth.hasPermission('LOOKUP_VALUE.READ'));
  readonly groups = this.facade.data;
  readonly filters = this.facade.filters;
  readonly isLoading = this.facade.isLoading;
  readonly pagination = this.facade.pagination;
  readonly uiError = computed(() => mapHttpErrorToUiState(this.facade.error()));
  private readonly nameTemplate = viewChild.required<TemplateRef<any>>('nameCell');
  private readonly statusTemplate = viewChild.required<TemplateRef<any>>('statusCell');
  private readonly actionsTemplate = viewChild.required<TemplateRef<any>>('actionsCell');
  readonly columns = computed<TableColumn<LookupGroup>[]>(() => {
    const columns: TableColumn<LookupGroup>[] = [
      { key: 'name', label: 'Grupo', customTemplate: this.nameTemplate() },
      { key: 'description', label: 'Descripción', truncate: true },
      { key: 'status', label: 'Estado', align: 'center', customTemplate: this.statusTemplate() },
    ];
    if (this.canViewValues()) {
      columns.push({ key: 'actions', label: 'Acciones', align: 'center', customTemplate: this.actionsTemplate(), tdClass: 'w-40' });
    }
    return columns;
  });

  ngOnInit(): void { this.facade.load(); }
  search(value: string): void { this.facade.updateFilters({ search: value }); }
}
