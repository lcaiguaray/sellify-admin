import { Component, computed, inject, OnInit, TemplateRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeArrowLeft01, hugeDelete04, hugeDownload03 } from '@ng-icons/huge-icons';
import { tablerDots, tablerLoader2 } from '@ng-icons/tabler-icons';
import { toast } from '@spartan-ng/brain/sonner';
import { mapHttpErrorToUiState, parseHttpError } from '@core/utils/http-error.util';
import { DataTableComponent } from '@ui/data-table/data-table';
import { TableColumn } from '@ui/data-table/data-table.model';
import { ListToolbar } from '@ui/list-toolbar';
import { PageHeader } from '@ui/page-header';
import { Pagination } from '@ui/pagination';
import StatusBadge from '@ui/status-badge';
import TableRowSkeleton from '@ui/table-row-skeleton';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmCardImports } from '@ui-spartan/card';
import { HlmDialogService } from '@ui-spartan/dialog';
import { HlmDropdownMenuImports } from '@ui-spartan/dropdown-menu';
import { HlmTableImports } from '@ui-spartan/table';
import { LookupValueFacade } from '../../../application/facades/lookup-value.facade';
import { LookupValue } from '../../../domain/models/lookup-value.model';
import { LookupValueFormDialog } from '../../components/lookup-value-form-dialog';
import { AuthFacade } from '@modules/auth';

@Component({
  selector: 'app-lookup-value-list-page',
  imports: [
    FormsModule,
    RouterLink,
    NgIcon,
    HlmButtonImports,
    HlmCardImports,
    HlmDropdownMenuImports,
    HlmTableImports,
    DataTableComponent,
    ListToolbar,
    PageHeader,
    Pagination,
    StatusBadge,
    TableRowSkeleton,
  ],
  providers: [provideIcons({ hugeArrowLeft01, hugeDelete04, hugeDownload03, tablerDots, tablerLoader2 })],
  template: `
    <a hlmBtn variant="ghost" size="sm" routerLink="../.." class="mb-3 -ml-2">
      <ng-icon name="hugeArrowLeft01" /> Volver a catálogos
    </a>
    <app-page-header
      class="mb-4"
      [title]="'Valores de ' + lookupGroupId"
      description="Gestione las opciones disponibles en este catálogo"
      [actionLabel]="canWrite() ? 'Nuevo valor' : ''"
      (action)="openForm()"
    />
    <app-list-toolbar class="mb-4" [searchTerm]="filters().search" (searchChange)="search($event)">
      <button hlmBtn variant="outline"><ng-icon name="hugeDownload03" /> Exportar</button>
    </app-list-toolbar>
    <hlm-card size="sm" class="mb-4 w-full p-0">
      <div hlmCardContent class="p-0">
        @if (isLoading()) {
          <div hlmTableContainer><app-table-row-skeleton [rows]="5" [columns]="5" /></div>
        } @else {
          <app-data-table [data]="values()" [columns]="columns()" [error]="uiError()" />
        }
      </div>
    </hlm-card>
    <ng-template #codeCell let-value>
      <span class="rounded bg-muted px-2 py-1 font-mono text-xs">{{ value.code }}</span>
    </ng-template>
    <ng-template #statusCell let-value><app-status-badge [status]="value.active" /></ng-template>
    <ng-template #actionsCell let-value>
      <button hlmBtn size="icon" variant="outline" [hlmDropdownMenuTrigger]="actionsMenu" [disabled]="processingIds().has(value.id)">
        <ng-icon [name]="processingIds().has(value.id) ? 'tablerLoader2' : 'tablerDots'" [class.animate-spin]="processingIds().has(value.id)" />
      </button>
      <ng-template #actionsMenu>
        <hlm-dropdown-menu class="w-44">
          @if (canManage()) {
            <button hlmDropdownMenuItem variant="destructive" (click)="toggle(value)">
              <ng-icon name="hugeDelete04" /> {{ value.active ? 'Deshabilitar' : 'Habilitar' }}
            </button>
          }
        </hlm-dropdown-menu>
      </ng-template>
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
export default class LookupValueListPage implements OnInit {
  protected readonly facade = inject(LookupValueFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly dialogs = inject(HlmDialogService);
  private readonly auth = inject(AuthFacade);
  readonly canWrite = computed(() => this.auth.hasPermission('LOOKUP_VALUE.WRITE'));
  readonly canManage = computed(() => this.auth.hasPermission('LOOKUP_VALUE.MANAGE'));
  protected readonly lookupGroupId = this.route.snapshot.paramMap.get('lookupGroupId') ?? '';
  readonly values = this.facade.data;
  readonly filters = this.facade.filters;
  readonly isLoading = this.facade.isLoading;
  readonly pagination = this.facade.pagination;
  readonly processingIds = this.facade.processingIds;
  readonly uiError = computed(() => mapHttpErrorToUiState(this.facade.error()));
  private readonly codeTemplate = viewChild.required<TemplateRef<any>>('codeCell');
  private readonly statusTemplate = viewChild.required<TemplateRef<any>>('statusCell');
  private readonly actionsTemplate = viewChild.required<TemplateRef<any>>('actionsCell');
  readonly columns = computed<TableColumn<LookupValue>[]>(() => {
    const columns: TableColumn<LookupValue>[] = [
      { key: 'code', label: 'Código', customTemplate: this.codeTemplate() },
      { key: 'name', label: 'Nombre' },
      { key: 'description', label: 'Descripción', truncate: true },
      { key: 'status', label: 'Estado', align: 'center', customTemplate: this.statusTemplate() },
    ];
    if (this.canManage()) {
      columns.push({ key: 'actions', label: 'Acciones', align: 'center', customTemplate: this.actionsTemplate(), tdClass: 'w-24' });
    }
    return columns;
  });

  ngOnInit(): void { this.facade.load(this.lookupGroupId); }
  search(value: string): void { this.facade.updateFilters({ search: value }); }
  openForm(): void {
    this.dialogs.open(LookupValueFormDialog, { context: { lookupGroupId: this.lookupGroupId }, disableClose: true });
  }
  async toggle(value: LookupValue): Promise<void> {
    try {
      const response = value.active ? await this.facade.disable(value.id) : await this.facade.enable(value.id);
      toast.success(response.message);
    } catch (error) {
      toast.error(parseHttpError(error));
    }
  }
}
