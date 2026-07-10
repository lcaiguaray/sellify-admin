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
import { CategoryFacade } from '@modules/catalog/category/application/facades/category.facade';
import { FormsModule } from '@angular/forms';
import { CategoryCreateDialog } from '../../components/category-form-dialog';
import { HlmDialogService } from '@ui-spartan/dialog';
import { Pagination } from '@ui/pagination';
import { Category } from '../../../domain/models/category.model';
import { PageHeader } from '@ui/page-header';
import { ListToolbar } from '@ui/list-toolbar';
import { DataTableComponent } from '@ui/data-table/data-table';
import StatusBadge from '@ui/status-badge';
import { HlmDropdownMenuImports } from '@ui/spartan/dropdown-menu/src';
import { TableColumn } from '@ui/data-table/data-table.model';
import { tablerDots, tablerLoader2 } from '@ng-icons/tabler-icons';
import { mapHttpErrorToUiState, parseHttpError } from '@core/utils/http-error.util';
import { toast } from '@spartan-ng/brain/sonner';

@Component({
  selector: 'app-category-list-page',
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
      title="Categorías"
      description="Gestione las categorías de productos"
      actionLabel="Nueva Categoría"
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
          <app-data-table [data]="categories()" [columns]="tableColumns()" [error]="uiError()" />
        }
      </div>
    </hlm-card>

    <ng-template #nameCell let-category>
      <div class="flex flex-col">
        <span class="font-medium text-foreground">{{ category.name }}</span>
        <span class="text-xs text-muted-foreground">{{ category.slug }}</span>
      </div>
    </ng-template>

    <ng-template #statusCell let-category>
      <app-status-badge [status]="category.active" />
    </ng-template>

    <ng-template #actionsCell let-category>
      <button
        hlmBtn
        size="icon"
        variant="outline"
        [hlmDropdownMenuTrigger]="menuAction"
        align="end"
        class="h-8 w-8"
        [disabled]="processingIds().has(category.id)"
      >
        @if (processingIds().has(category.id)) {
          <ng-icon name="tablerLoader2" class="animate-spin text-muted-foreground" />
        } @else {
          <ng-icon name="tablerDots" class="text-muted-foreground" />
        }
      </button>

      <ng-template #menuAction>
        <hlm-dropdown-menu class="w-40">
          <button hlmDropdownMenuItem (click)="onOpenFormDialog(category)">
            <ng-icon name="hugeEdit02" class="mr-2 h-4 w-4" /> Editar
          </button>
          <hlm-dropdown-menu-separator />
          <button hlmDropdownMenuItem variant="destructive" (click)="onToggleStatus(category)">
            <ng-icon name="hugeDelete04" class="mr-2 h-4 w-4" />
            {{ category.active ? 'Deshabilitar' : 'Habilitar' }}
          </button>
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
  private readonly facade = inject(CategoryFacade);
  private readonly dialogService = inject(HlmDialogService);

  readonly categories = this.facade.data;
  readonly isLoading = this.facade.isLoading;
  readonly filters = this.facade.filters;
  readonly pagination = this.facade.pagination;
  readonly error = this.facade.error;
  readonly processingIds = this.facade.processingIds;
  readonly uiError = computed(() => mapHttpErrorToUiState(this.error()));

  private readonly nameTemplate = viewChild.required<TemplateRef<any>>('nameCell');
  private readonly statusTemplate = viewChild.required<TemplateRef<any>>('statusCell');
  private readonly actionsTemplate = viewChild.required<TemplateRef<any>>('actionsCell');

  readonly tableColumns = computed<TableColumn<Category>[]>(() => [
    {
      key: 'name',
      label: 'Nombre',
      customTemplate: this.nameTemplate(),
    },
    {
      key: 'description',
      label: 'Descripción',
      truncate: true,
      customClass: 'max-w-[200px] md:max-w-[300px]',
    },
    {
      key: 'status',
      label: 'Estado',
      align: 'center',
      customTemplate: this.statusTemplate(),
    },
    {
      key: 'actions',
      label: 'Acciones',
      align: 'center',
      customTemplate: this.actionsTemplate(),
      tdClass: 'w-24',
    },
  ]);

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

  onOpenFormDialog(category?: Category) {
    this.dialogService.open(CategoryCreateDialog, {
      context: { category: category ?? null },
      disableClose: true,
    });
  }

  async onToggleStatus(category: Category) {
    try {
      const response = category.active
        ? await this.facade.disable(category.id)
        : await this.facade.enable(category.id);
      toast.success(response.message);
    } catch (err: any) {
      toast.error(parseHttpError(err));
    }
  }
}
