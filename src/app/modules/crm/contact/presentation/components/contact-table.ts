import { Component, input, output } from '@angular/core';
import { HlmSkeletonImports } from '@ui-spartan/skeleton';
import { HlmTableImports } from '@ui-spartan/table';
import StatusBadge from '@ui/status-badge';
import { Contact } from '../../domain/models/contact.model';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerDots } from '@ng-icons/tabler-icons';
import { HlmButtonImports } from '@ui-spartan/button';
import { HlmDropdownMenuImports } from '@ui-spartan/dropdown-menu';
import { hugeDelete04, hugeEdit02, hugeUser, hugeTruck, hugeUserGroup } from '@ng-icons/huge-icons';
import { HlmBadgeImports } from '@ui-spartan/badge';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-contact-table',
  imports: [
    CommonModule,
    NgIcon,
    HlmSkeletonImports,
    HlmTableImports,
    HlmButtonImports,
    HlmDropdownMenuImports,
    HlmBadgeImports,
    StatusBadge,
  ],
  providers: [provideIcons({ tablerDots, hugeEdit02, hugeDelete04, hugeUser, hugeTruck, hugeUserGroup })],
  host: {
    style: 'display: contents;',
  },
  template: `
    @if (data().length === 0) {
      <tr hlmTableRow>
        <td hlmTableCell class="text-center" [attr.colspan]="6">No se encontraron resultados.</td>
      </tr>
    } @else {
      @for (item of data(); track item.id) {
        <tr hlmTableRow>
          <td hlmTableCell>
            <div class="font-medium">{{ item.name }}</div>
            <div class="text-xs text-muted-foreground">{{ item.documentType }}: {{ item.documentNumber }}</div>
          </td>
          <td hlmTableCell>
            <div class="flex flex-col gap-1">
              @if(item.email) { <div class="text-xs">{{ item.email }}</div> }
              @if(item.phone) { <div class="text-xs text-muted-foreground">{{ item.phone }}</div> }
              @if(!item.email && !item.phone) { <span class="text-muted-foreground">—</span> }
            </div>
          </td>
          <td hlmTableCell>
            <div class="flex gap-1 flex-wrap">
              @if (item.isCustomer) {
                <span hlmBadge variant="outline" class="bg-blue-50 text-blue-700 border-blue-200 gap-1 text-[10px] px-1 py-0 h-5">
                  <ng-icon name="hugeUser" class="text-[12px]" /> Cliente
                </span>
              }
              @if (item.isProvider) {
                <span hlmBadge variant="outline" class="bg-orange-50 text-orange-700 border-orange-200 gap-1 text-[10px] px-1 py-0 h-5">
                  <ng-icon name="hugeTruck" class="text-[12px]" /> Proveedor
                </span>
              }
              @if (item.isEmployee) {
                <span hlmBadge variant="outline" class="bg-purple-50 text-purple-700 border-purple-200 gap-1 text-[10px] px-1 py-0 h-5">
                  <ng-icon name="hugeUserGroup" class="text-[12px]" /> Trabajador
                </span>
              }
            </div>
          </td>
          <td hlmTableCell align="center">
            <app-status-badge [status]="item.active" />
          </td>
          <td hlmTableCell class="text-center">
            <button
              hlmBtn
              size="icon"
              variant="outline"
              [hlmDropdownMenuTrigger]="menuAction"
              align="end"
            >
              <ng-icon name="tablerDots" />
            </button>

            <ng-template #menuAction>
              <hlm-dropdown-menu>
                <hlm-dropdown-menu-group>
                  <button hlmDropdownMenuItem (click)="edit.emit(item)">
                    <ng-icon name="hugeEdit02" />
                    Editar
                  </button>
                </hlm-dropdown-menu-group>
                <hlm-dropdown-menu-separator />
                <hlm-dropdown-menu-group>
                  <button hlmDropdownMenuItem variant="destructive">
                    <ng-icon name="hugeDelete04" />
                    Deshabilitar
                  </button>
                </hlm-dropdown-menu-group>
              </hlm-dropdown-menu>
            </ng-template>
          </td>
        </tr>
      }
    }
  `,
})
export default class ContactTable {
  data = input<Contact[]>([]);
  edit = output<Contact>();
}
