import { Component, computed, inject, OnInit, TemplateRef, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButtonImports } from '@ui-spartan/button';
import { hugeDelete04, hugeDownload03, hugeEdit02 } from '@ng-icons/huge-icons';
import { HlmCardImports } from '@ui-spartan/card';
import { HlmInputImports } from '@ui-spartan/input';
import TableRowSkeleton from '@ui/table-row-skeleton';
import { HlmTableImports } from '@ui-spartan/table';
import { HlmBadgeImports } from '@ui-spartan/badge';
import { HlmInputGroupImports } from '@ui-spartan/input-group';
import { HlmSkeletonImports } from '@ui-spartan/skeleton';
import { BrandFacade } from '@modules/catalog/brand/application/facades/brand.facade';
import { FormsModule } from '@angular/forms';
import { BrandCreateDialog } from '../../components/brand-form-dialog';
import { HlmDialogService } from '@ui-spartan/dialog';
import { Pagination } from '@ui/pagination';
import { Brand } from '../../../domain/models/brand.model';
import { PageHeader } from '@ui/page-header';
import { ListToolbar } from '@ui/list-toolbar';
import { DataTableComponent } from '@ui/data-table/data-table';
import StatusBadge from '@ui/status-badge';
import { HlmDropdownMenuImports } from '@ui/spartan/dropdown-menu/src';
import { TableColumn } from '@ui/data-table/data-table.model';
import { tablerDots, tablerLoader2 } from '@ng-icons/tabler-icons';
import { mapHttpErrorToUiState, parseHttpError } from '@core/utils/http-error.util';
import { toast } from '@spartan-ng/brain/sonner';
import { AuthFacade } from '@modules/auth';

@Component({
  selector: 'app-brand-list-page',
  imports: [
    HlmButtonImports,
    HlmCardImports,
    HlmInputImports,
    HlmTableImports,
    HlmBadgeImports,
    HlmInputGroupImports,
    HlmSkeletonImports,
    HlmDropdownMenuImports,
    NgIcon,
    TableRowSkeleton,
    StatusBadge,
    Pagination,
    FormsModule,
    PageHeader,
    ListToolbar,
    DataTableComponent,
  ],
  providers: [
    provideIcons({ hugeDownload03, tablerDots, hugeEdit02, hugeDelete04, tablerLoader2 }),
  ],
  styleUrl: './list-page.css',
  template: `
    <app-page-header
      class="mb-4"
      title="Marcas"
      description="Gestione las marcas de su aplicación"
      [actionLabel]="canWrite() ? 'Nueva Marca' : ''"
      (action)="onOpenFormDialog()"
    />

    <app-list-toolbar
      class="mb-4"
      [searchTerm]="filters()?.search"
      (searchChange)="onSearchChange($event)"
    >
      <button hlmBtn variant="outline">
        <ng-icon name="hugeDownload03" />
        <span>Exportar</span>
      </button>
    </app-list-toolbar>

    <hlm-card size="sm" class="w-full mb-4 p-0">
      <div hlmCardContent class="p-0">
        @if (isLoading()) {
          <div hlmTableContainer class="overflow-x-auto w-full">
            <app-table-row-skeleton [rows]="5" [columns]="4" />
          </div>
        } @else {
          <app-data-table [data]="brands()" [columns]="tableColumns()" [error]="uiError()" />
        }
      </div>
    </hlm-card>

    <ng-template #nameCell let-brand>
      <div class="flex flex-col">
        <span class="font-medium text-foreground">{{ brand.name }}</span>
        <span class="text-xs text-muted-foreground">{{ brand.slug }}</span>
      </div>
    </ng-template>

    <ng-template #statusCell let-brand>
      <app-status-badge [status]="brand.active" />
    </ng-template>

    <ng-template #actionsCell let-brand>
      <button
        hlmBtn
        size="icon"
        variant="outline"
        [hlmDropdownMenuTrigger]="menuAction"
        align="end"
        class="h-8 w-8"
        [disabled]="processingIds().has(brand.id)"
      >
        @if (processingIds().has(brand.id)) {
          <ng-icon name="tablerLoader2" class="animate-spin text-muted-foreground" />
        } @else {
          <ng-icon name="tablerDots" class="text-muted-foreground" />
        }
      </button>

      <ng-template #menuAction>
        <hlm-dropdown-menu class="w-40">
          @if (canWrite()) {
            <button hlmDropdownMenuItem (click)="onOpenFormDialog(brand)">
              <ng-icon name="hugeEdit02" class="mr-2 h-4 w-4" /> Editar
            </button>
          }
          @if (canWrite() && canManage()) {
            <hlm-dropdown-menu-separator />
          }
          @if (canManage()) {
            <button hlmDropdownMenuItem variant="destructive" (click)="onToggleStatus(brand)">
              <ng-icon name="hugeDelete04" class="mr-2 h-4 w-4" />
              {{ brand.active ? 'Deshabilitar' : 'Habilitar' }}
            </button>
          }
        </hlm-dropdown-menu>
      </ng-template>
    </ng-template>

    <app-pagination
      [pageSize]="pagination().pageSize"
      [currentPage]="pagination().pageNumber + 1"
      [totalPages]="pagination().totalPages"
      (pageChanged)="onPageChange($event)"
      (pageSizeChanged)="onPageSizeChange($event)"
    />
  `,
})
export default class ListPage implements OnInit {
  private readonly facade = inject(BrandFacade);
  private readonly dialogService = inject(HlmDialogService);
  private readonly auth = inject(AuthFacade);
  readonly canWrite = computed(() => this.auth.hasPermission('BRAND.WRITE'));
  readonly canManage = computed(() => this.auth.hasPermission('BRAND.MANAGE'));

  readonly brands = this.facade.data;
  readonly isLoading = this.facade.isLoading;
  readonly filters = this.facade.filters;
  readonly pagination = this.facade.pagination;
  readonly error = this.facade.error;
  readonly processingIds = this.facade.processingIds;
  readonly uiError = computed(() => mapHttpErrorToUiState(this.error()));

  private readonly nameTemplate = viewChild.required<TemplateRef<any>>('nameCell');
  private readonly statusTemplate = viewChild.required<TemplateRef<any>>('statusCell');
  private readonly actionsTemplate = viewChild.required<TemplateRef<any>>('actionsCell');

  readonly tableColumns = computed<TableColumn<Brand>[]>(() => {
    const columns: TableColumn<Brand>[] = [
      {
        key: 'name',
        label: 'Nombre',
        customTemplate: this.nameTemplate(),
      },
      {
        key: 'description',
        label: 'Descripción',
        truncate: true,
        tdClass: 'max-w-[200px] md:max-w-[300px]',
      },
      {
        key: 'status',
        label: 'Estado',
        align: 'center',
        customTemplate: this.statusTemplate(),
      },
    ];
    if (this.canWrite() || this.canManage()) {
      columns.push({
        key: 'actions',
        label: 'Acciones',
        align: 'center',
        customTemplate: this.actionsTemplate(),
        tdClass: 'w-24',
      });
    }
    return columns;
  });

  ngOnInit(): void {
    this.facade.load();
  }

  onReload() {
    this.facade.load();
  }

  onSearchChange(searchTerm: string) {
    this.facade.updateFilters({ search: searchTerm });
  }

  onPageChange(page: number) {
    this.facade.changePage(page - 1);
  }

  onPageSizeChange(value: number) {
    this.facade.changePageSize(value);
  }

  onOpenFormDialog(brand?: Brand) {
    this.dialogService.open(BrandCreateDialog, {
      context: { brand: brand ?? null },
      disableClose: true,
    });
  }

  async onToggleStatus(brand: Brand) {
    try {
      const response = brand.active
        ? await this.facade.disable(brand.id)
        : await this.facade.enable(brand.id);
      toast.success(response.message);
    } catch (err: any) {
      toast.error(parseHttpError(err));
    }
  }
}
