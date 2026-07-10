import { Component, inject, OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButtonImports } from '@ui-spartan/button';
import { hugeDownload03, hugePlusSign, hugeSearch01 } from '@ng-icons/huge-icons';
import { HlmCardImports } from '@ui-spartan/card';
import { HlmInputImports } from '@ui-spartan/input';
import TableRowSkeleton from '@ui/table-row-skeleton';
import { HlmTableImports } from '@ui-spartan/table';
import { HlmBadgeImports } from '@ui-spartan/badge';
import { HlmInputGroupImports } from '@ui-spartan/input-group';
import { HlmSkeletonImports } from '@ui-spartan/skeleton';
import { ProductFacade } from '@modules/catalog/product/application/facades/product.facade';
import { FormsModule } from '@angular/forms';
import { ProductCreateDialog } from '../../components/product-form-dialog';
import { HlmDialogService } from '@ui-spartan/dialog';
import { Pagination } from '@ui/pagination';
import ProductTable from '../../components/product-table';
import { Product } from '../../../domain/models/product.model';

@Component({
  selector: 'app-product-list-page',
  imports: [
    NgIcon,
    HlmButtonImports,
    HlmCardImports,
    HlmInputImports,
    HlmTableImports,
    HlmBadgeImports,
    HlmInputGroupImports,
    HlmSkeletonImports,
    TableRowSkeleton,
    ProductTable,
    Pagination,
    FormsModule,
  ],
  providers: [provideIcons({ hugePlusSign, hugeDownload03, hugeSearch01 })],
  styleUrl: './list-page.css',
  template: `
    <div class="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-xl font-bold">Listado de Productos</h1>
        <div>Gestione los productos de su catálogo</div>
      </div>

      <div class="flex flex-col gap-2 md:flex-row md:items-center">
        <button hlmBtn (click)="onOpenFormDialog()">
          <ng-icon name="hugePlusSign" />
          Nuevo
        </button>
      </div>
    </div>

    <div class="flex items-center mb-4 gap-2">
      <div class="flex-1">
        <hlm-input-group>
          <input
            hlmInputGroupInput
            placeholder="Buscar productos..."
            [ngModel]="filters()?.search"
            (ngModelChange)="onSearchChange($event)"
          />
          <hlm-input-group-addon>
            <ng-icon name="hugeSearch01" />
          </hlm-input-group-addon>
        </hlm-input-group>
      </div>

      <div>
        <button hlmBtn>
          <ng-icon name="hugeDownload03" />
          <span class="hidden md:flex">Exportar</span>
        </button>
      </div>
    </div>

    <hlm-card size="sm" class="w-full mb-4 p-0">
      <div hlmCardContent class="p-0">
        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTableHeader class="bg-muted/50">
              <tr hlmTableRow>
                <th hlmTableHead>Nombre / Categoría</th>
                <th hlmTableHead>SKU</th>
                <th hlmTableHead>Precio Base</th>
                <th hlmTableHead>Stock Inicial</th>
                <th hlmTableHead class="w-36 text-center">Estado</th>
                <th hlmTableHead class="w-24 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody hlmTableBody>
              @if (facade.isLoading()) {
                <app-table-row-skeleton [rows]="1" [columns]="6" />
              } @else {
                <app-product-table [data]="facade.data()" (edit)="onOpenFormDialog($event)" />
              }
            </tbody>
          </table>
        </div>
      </div>
    </hlm-card>

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
  readonly facade = inject(ProductFacade);
  private readonly dialogService = inject(HlmDialogService);

  readonly products = this.facade.data;
  readonly isLoading = this.facade.isLoading;
  readonly pagination = this.facade.pagination;
  readonly filters = this.facade.filters;

  ngOnInit(): void {
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

  toggleStatus(id: string, active: boolean) {
    if (active) {
      this.facade.disable(id);
    } else {
      this.facade.enable(id);
    }
  }

  onOpenFormDialog(product?: Product) {
    this.dialogService.open(ProductCreateDialog, {
      context: { product: product ?? null },
      disableClose: true,
    });
  }
}
