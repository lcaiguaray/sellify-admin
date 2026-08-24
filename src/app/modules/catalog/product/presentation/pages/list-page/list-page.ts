import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, OnInit, TemplateRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeDelete04, hugeDownload03, hugeEdit02, hugeTick02 } from '@ng-icons/huge-icons';
import { tablerDots, tablerLoader2 } from '@ng-icons/tabler-icons';
import { toast } from '@spartan-ng/brain/sonner';
import { mapHttpErrorToUiState, parseHttpError } from '@core/utils/http-error.util';
import { AuthFacade } from '@modules/auth';
import { ProductFacade } from '@modules/catalog/product/application/facades/product.facade';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmCardImports } from '@ui-spartan/card';
import { DataTableComponent } from '@ui/data-table/data-table';
import { TableColumn } from '@ui/data-table/data-table.model';
import { HlmDialogService } from '@ui-spartan/dialog';
import { HlmDropdownMenuImports } from '@ui-spartan/dropdown-menu';
import { HlmTableImports } from '@ui-spartan/table';
import { ListToolbar } from '@ui/list-toolbar';
import { PageHeader } from '@ui/page-header';
import { Pagination } from '@ui/pagination';
import StatusBadge from '@ui/status-badge';
import TableRowSkeleton from '@ui/table-row-skeleton';
import { Product } from '../../../domain/models/product.model';
import { ProductCreateDialog } from '../../components/product-form-dialog';

@Component({
  selector: 'app-product-list-page',
  imports: [
    CurrencyPipe,
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
  providers: [
    provideIcons({
      hugeDelete04,
      hugeDownload03,
      hugeEdit02,
      hugeTick02,
      tablerDots,
      tablerLoader2,
    }),
  ],
  styleUrl: './list-page.css',
  template: `
    <app-page-header
      class="mb-4"
      title="Productos"
      description="Gestione los productos y variantes de su catálogo"
      [actionLabel]="canWrite() ? 'Nuevo Producto' : ''"
      (action)="onOpenFormDialog()"
    />

    <app-list-toolbar
      class="mb-4"
      [searchTerm]="filters().search"
      (searchChange)="onSearchChange($event)"
    >
      <button hlmBtn variant="outline">
        <ng-icon name="hugeDownload03" />
        <span>Exportar</span>
      </button>
    </app-list-toolbar>

    <hlm-card size="sm" class="mb-4 w-full p-0">
      <div hlmCardContent class="p-0">
        @if (isLoading()) {
          <div hlmTableContainer class="w-full overflow-x-auto">
            <app-table-row-skeleton [rows]="5" [columns]="tableColumns().length" />
          </div>
        } @else {
          <app-data-table [data]="products()" [columns]="tableColumns()" [error]="uiError()" />
        }
      </div>
    </hlm-card>

    <ng-template #nameCell let-product>
      <div class="flex flex-col">
        <span class="font-medium text-foreground">{{ product.name }}</span>
        <span class="text-xs text-muted-foreground">
          {{ product.categoryName }} · {{ product.brandName || 'Sin marca' }}
        </span>
      </div>
    </ng-template>

    <ng-template #skuCell let-product>
      @if (product.hasVariant) {
        <div class="flex flex-col">
          <span>{{ product.variants.length }} variantes</span>
          <span class="text-xs text-muted-foreground">{{
            product.variants[0]?.sku || 'Sin SKU'
          }}</span>
        </div>
      } @else {
        <span>{{ product.sku || 'Sin SKU' }}</span>
      }
    </ng-template>

    <ng-template #priceCell let-product>
      <div class="flex flex-col">
        <span>{{ product.basePrice | currency: 'PEN' : 'symbol-narrow' }}</span>
        <span class="text-xs text-muted-foreground">
          por {{ product.unitMeasureSymbol || product.unitMeasureName }}
        </span>
      </div>
    </ng-template>

    <ng-template #statusCell let-product>
      <app-status-badge [status]="product.active" />
    </ng-template>

    <ng-template #actionsCell let-product>
      <button
        hlmBtn
        size="icon"
        variant="outline"
        [hlmDropdownMenuTrigger]="menuAction"
        align="end"
        class="h-8 w-8"
        [disabled]="processingIds().has(product.id)"
      >
        @if (processingIds().has(product.id)) {
          <ng-icon name="tablerLoader2" class="animate-spin text-muted-foreground" />
        } @else {
          <ng-icon name="tablerDots" class="text-muted-foreground" />
        }
      </button>

      <ng-template #menuAction>
        <hlm-dropdown-menu class="w-40">
          @if (canWrite()) {
            <button hlmDropdownMenuItem (click)="onOpenFormDialog(product)">
              <ng-icon name="hugeEdit02" class="mr-2 h-4 w-4" />
              Editar
            </button>
          }
          @if (canWrite() && canManage()) {
            <hlm-dropdown-menu-separator />
          }
          @if (canManage()) {
            <button hlmDropdownMenuItem variant="destructive" (click)="onToggleStatus(product)">
              <ng-icon
                [name]="product.active ? 'hugeDelete04' : 'hugeTick02'"
                class="mr-2 h-4 w-4"
              />
              {{ product.active ? 'Deshabilitar' : 'Habilitar' }}
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
  private readonly facade = inject(ProductFacade);
  private readonly dialogService = inject(HlmDialogService);
  private readonly auth = inject(AuthFacade);

  readonly canWrite = computed(() => this.auth.hasPermission('PRODUCT.WRITE'));
  readonly canManage = computed(() => this.auth.hasPermission('PRODUCT.MANAGE'));
  readonly products = this.facade.data;
  readonly isLoading = this.facade.isLoading;
  readonly filters = this.facade.filters;
  readonly pagination = this.facade.pagination;
  readonly processingIds = this.facade.processingIds;
  readonly uiError = computed(() => mapHttpErrorToUiState(this.facade.error()));

  private readonly nameTemplate = viewChild.required<TemplateRef<any>>('nameCell');
  private readonly skuTemplate = viewChild.required<TemplateRef<any>>('skuCell');
  private readonly priceTemplate = viewChild.required<TemplateRef<any>>('priceCell');
  private readonly statusTemplate = viewChild.required<TemplateRef<any>>('statusCell');
  private readonly actionsTemplate = viewChild.required<TemplateRef<any>>('actionsCell');

  readonly tableColumns = computed<TableColumn<Product>[]>(() => {
    const columns: TableColumn<Product>[] = [
      { key: 'name', label: 'Producto', customTemplate: this.nameTemplate() },
      { key: 'sku', label: 'SKU / Variantes', customTemplate: this.skuTemplate() },
      { key: 'price', label: 'Precio', customTemplate: this.priceTemplate() },
      { key: 'status', label: 'Estado', align: 'center', customTemplate: this.statusTemplate() },
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

  onSearchChange(search: string): void {
    this.facade.updateFilters({ search });
  }

  onPageChange(page: number): void {
    this.facade.changePage(page - 1);
  }

  onPageSizeChange(size: number): void {
    this.facade.changePageSize(size);
  }

  onOpenFormDialog(product?: Product): void {
    if (!this.canWrite()) return;
    this.dialogService.open(ProductCreateDialog, {
      context: { product: product ?? null },
      disableClose: true,
    });
  }

  async onToggleStatus(product: Product): Promise<void> {
    try {
      const response = product.active
        ? await this.facade.disable(product.id)
        : await this.facade.enable(product.id);
      toast.success(response.message);
    } catch (err: any) {
      toast.error(parseHttpError(err));
    }
  }
}
