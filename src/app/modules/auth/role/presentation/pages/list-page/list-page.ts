import { Component, computed, inject, OnInit, TemplateRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeDelete04, hugeDownload03, hugeEdit02 } from '@ng-icons/huge-icons';
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
import { RoleFacade } from '../../../application/facades/role.facade';
import { Role } from '../../../domain/models/role.model';
import { RoleFormDialog } from '../../components/role-form-dialog';
import { AuthFacade } from '@modules/auth';

@Component({
  selector: 'app-role-list-page',
  imports: [
    FormsModule,
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
  providers: [provideIcons({ hugeDelete04, hugeDownload03, hugeEdit02, tablerDots, tablerLoader2 })],
  template: `
    <app-page-header
      class="mb-4"
      title="Roles"
      description="Gestione los roles disponibles en la empresa"
      [actionLabel]="canWrite() ? 'Nuevo rol' : ''"
      (action)="openForm()"
    />

    <app-list-toolbar class="mb-4" [searchTerm]="filters().search" (searchChange)="search($event)">
      <button hlmBtn variant="outline"><ng-icon name="hugeDownload03" /> Exportar</button>
    </app-list-toolbar>

    <hlm-card size="sm" class="mb-4 w-full p-0">
      <div hlmCardContent class="p-0">
        @if (isLoading()) {
          <div hlmTableContainer><app-table-row-skeleton [rows]="5" [columns]="4" /></div>
        } @else {
          <app-data-table [data]="roles()" [columns]="columns()" [error]="uiError()" />
        }
      </div>
    </hlm-card>

    <ng-template #nameCell let-role>
      <div class="flex flex-col">
        <span class="font-medium">{{ role.name }}</span>
        <span class="text-xs text-muted-foreground">{{ role.id }}</span>
      </div>
    </ng-template>
    <ng-template #statusCell let-role><app-status-badge [status]="role.active" /></ng-template>
    <ng-template #actionsCell let-role>
      <button
        hlmBtn
        size="icon"
        variant="outline"
        [hlmDropdownMenuTrigger]="actionsMenu"
        [disabled]="processingIds().has(role.id)"
      >
        <ng-icon [name]="processingIds().has(role.id) ? 'tablerLoader2' : 'tablerDots'" [class.animate-spin]="processingIds().has(role.id)" />
      </button>
      <ng-template #actionsMenu>
        <hlm-dropdown-menu class="w-44">
          @if (canWrite()) {
            <button hlmDropdownMenuItem (click)="openForm(role)"><ng-icon name="hugeEdit02" /> Editar</button>
          }
          @if (canWrite() && canManage()) { <hlm-dropdown-menu-separator /> }
          @if (canManage()) {
            <button hlmDropdownMenuItem variant="destructive" (click)="toggle(role)">
              <ng-icon name="hugeDelete04" /> {{ role.active ? 'Deshabilitar' : 'Habilitar' }}
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
export default class RoleListPage implements OnInit {
  protected readonly facade = inject(RoleFacade);
  private readonly dialogs = inject(HlmDialogService);
  private readonly auth = inject(AuthFacade);
  readonly canWrite = computed(() => this.auth.hasPermission('ROLE.WRITE'));
  readonly canManage = computed(() => this.auth.hasPermission('ROLE.MANAGE'));
  readonly roles = this.facade.data;
  readonly filters = this.facade.filters;
  readonly isLoading = this.facade.isLoading;
  readonly pagination = this.facade.pagination;
  readonly processingIds = this.facade.processingIds;
  readonly uiError = computed(() => mapHttpErrorToUiState(this.facade.error()));

  private readonly nameTemplate = viewChild.required<TemplateRef<any>>('nameCell');
  private readonly statusTemplate = viewChild.required<TemplateRef<any>>('statusCell');
  private readonly actionsTemplate = viewChild.required<TemplateRef<any>>('actionsCell');
  readonly columns = computed<TableColumn<Role>[]>(() => {
    const columns: TableColumn<Role>[] = [
      { key: 'name', label: 'Rol', customTemplate: this.nameTemplate() },
      { key: 'description', label: 'Descripción', truncate: true },
      { key: 'status', label: 'Estado', align: 'center', customTemplate: this.statusTemplate() },
    ];
    if (this.canWrite() || this.canManage()) {
      columns.push({ key: 'actions', label: 'Acciones', align: 'center', customTemplate: this.actionsTemplate(), tdClass: 'w-24' });
    }
    return columns;
  });

  ngOnInit(): void { this.facade.load(); }
  search(value: string): void { this.facade.updateFilters({ search: value }); }
  openForm(role: Role | null = null): void {
    this.dialogs.open(RoleFormDialog, { context: { role }, disableClose: true });
  }
  async toggle(role: Role): Promise<void> {
    try {
      const response = role.active ? await this.facade.disable(role.id) : await this.facade.enable(role.id);
      toast.success(response.message);
    } catch (error) {
      toast.error(parseHttpError(error));
    }
  }
}
