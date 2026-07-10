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
import { ContactFacade } from '@modules/crm/contact/application/facades/contact.facade';
import { FormsModule } from '@angular/forms';
import { ContactCreateDialog } from '../../components/contact-form-dialog';
import { HlmDialogService } from '@ui-spartan/dialog';
import { Pagination } from '@ui/pagination';
import ContactTable from '../../components/contact-table';
import { Contact } from '../../../domain/models/contact.model';

@Component({
  selector: 'app-contact-list-page',
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
    ContactTable,
    Pagination,
    FormsModule,
  ],
  providers: [provideIcons({ hugePlusSign, hugeDownload03, hugeSearch01 })],
  host: {
    class: 'block w-full h-full',
  },
  template: `
    <div class="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-xl font-bold">Directorio de Contactos</h1>
        <div class="text-muted-foreground text-sm">Gestione sus clientes, proveedores y trabajadores</div>
      </div>

      <div class="flex flex-col gap-2 md:flex-row md:items-center">
        <button hlmBtn (click)="onOpenFormDialog()">
          <ng-icon name="hugePlusSign" />
          Nuevo
        </button>
      </div>
    </div>

    <div class="flex items-center gap-2 overflow-x-auto w-full mb-4">
      <button hlmBtn [variant]="(filters()?.role ?? 'all') === 'all' ? 'default' : 'outline'" (click)="onRoleChange('all')">Todos</button>
      <button hlmBtn [variant]="filters()?.role === 'customer' ? 'default' : 'outline'" (click)="onRoleChange('customer')">Clientes</button>
      <button hlmBtn [variant]="filters()?.role === 'provider' ? 'default' : 'outline'" (click)="onRoleChange('provider')">Proveedores</button>
      <button hlmBtn [variant]="filters()?.role === 'employee' ? 'default' : 'outline'" (click)="onRoleChange('employee')">Trabajadores</button>
    </div>

    <div class="flex items-center mb-4 gap-2">
      <div class="flex-1">
        <hlm-input-group>
          <input
            hlmInputGroupInput
            placeholder="Buscar por nombre, documento o email..."
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
                <th hlmTableHead>Nombre / Razón Social</th>
                <th hlmTableHead>Contacto</th>
                <th hlmTableHead>Roles</th>
                <th hlmTableHead class="w-36 text-center">Estado</th>
                <th hlmTableHead class="w-24 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody hlmTableBody>
              @if (facade.isLoading()) {
                <app-table-row-skeleton [rows]="1" [columns]="5" />
              } @else {
                <app-contact-table [data]="facade.data()" (edit)="onOpenFormDialog($event)" />
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
  readonly facade = inject(ContactFacade);
  private readonly dialogService = inject(HlmDialogService);

  readonly items = this.facade.data;
  readonly isLoading = this.facade.isLoading;
  readonly pagination = this.facade.pagination;
  readonly filters = this.facade.filters;

  ngOnInit(): void {
    this.facade.load();
  }

  onRoleChange(role: string) {
    this.facade.updateFilters({ role: role as any });
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

  onOpenFormDialog(item?: Contact) {
    this.dialogService.open(ContactCreateDialog, {
      context: { contact: item ?? null },
      disableClose: true,
    });
  }
}
