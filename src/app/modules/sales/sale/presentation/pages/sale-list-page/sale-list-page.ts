import { Component, inject, OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButtonImports } from '@ui-spartan/button';
import { hugePlusSign, hugeSearch01, hugeDownload03 } from '@ng-icons/huge-icons';
import { HlmCardImports } from '@ui-spartan/card';
import { HlmInputImports } from '@ui-spartan/input';
import { HlmTableImports } from '@ui-spartan/table';
import { HlmInputGroupImports } from '@ui-spartan/input-group';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SaleFacade } from '../../../application/facades/sale.facade';
import { Pagination } from '@ui/pagination';
import TableRowSkeleton from '@ui/table-row-skeleton';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-sale-list-page',
  standalone: true,
  imports: [
    NgIcon,
    HlmButtonImports,
    HlmCardImports,
    HlmInputImports,
    HlmTableImports,
    HlmInputGroupImports,
    FormsModule,
    RouterLink,
    Pagination,
    TableRowSkeleton,
    CurrencyPipe,
    DatePipe
  ],
  providers: [provideIcons({ hugePlusSign, hugeSearch01, hugeDownload03 })],
  template: `
    <div class="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-xl font-bold">Listado de Ventas</h1>
        <div>Revise todas las ventas realizadas</div>
      </div>

      <div class="flex flex-col gap-2 md:flex-row md:items-center">
        <a hlmBtn routerLink="new">
          <ng-icon name="hugePlusSign" />
          Nueva Venta
        </a>
      </div>
    </div>

    <div class="flex items-center mb-4 gap-2">
      <div class="flex-1">
        <hlm-input-group>
          <input
            hlmInputGroupInput
            placeholder="Buscar por cliente..."
            [ngModel]="filters()?.search"
            (ngModelChange)="onSearchChange($event)"
          />
          <hlm-input-group-addon>
            <ng-icon name="hugeSearch01" />
          </hlm-input-group-addon>
        </hlm-input-group>
      </div>

      <div>
        <button hlmBtn variant="outline">
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
                <th hlmTableHead>Fecha</th>
                <th hlmTableHead>Cliente</th>
                <th hlmTableHead class="text-right">Subtotal</th>
                <th hlmTableHead class="text-right">Impuesto</th>
                <th hlmTableHead class="text-right">Total</th>
              </tr>
            </thead>
            <tbody hlmTableBody>
              @if (isLoading()) {
                <app-table-row-skeleton [rows]="3" [columns]="5" />
              } @else {
                @for (sale of sales(); track sale.id) {
                  <tr hlmTableRow>
                    <td hlmTableCell>{{ sale.date | date:'dd/MM/yyyy HH:mm' }}</td>
                    <td hlmTableCell>{{ sale.clientName }}</td>
                    <td hlmTableCell class="text-right">{{ sale.subtotal | currency:'S/ ' }}</td>
                    <td hlmTableCell class="text-right">{{ sale.tax | currency:'S/ ' }}</td>
                    <td hlmTableCell class="text-right font-bold">{{ sale.total | currency:'S/ ' }}</td>
                  </tr>
                }
                @if (sales().length === 0) {
                  <tr hlmTableRow>
                    <td hlmTableCell colspan="5" class="text-center py-8 text-muted-foreground">
                      No hay ventas registradas
                    </td>
                  </tr>
                }
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
export default class SaleListPage implements OnInit {
  readonly facade = inject(SaleFacade);

  readonly sales = this.facade.data;
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
}
