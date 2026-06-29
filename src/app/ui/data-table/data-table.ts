import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmTableImports } from '@ui-spartan/table';
import { TableColumn } from './data-table.model';
import { UiErrorState } from '@core/shared-kernel/models/error.model';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeAlert01 } from '@ng-icons/huge-icons';

@Component({
  selector: 'app-data-table',
  imports: [HlmTableImports, CommonModule, NgIcon],
  providers: [provideIcons({ hugeAlert01 })],
  template: `
    <div hlmTableContainer class="overflow-x-auto w-full">
      <table hlmTable class="w-full">
        <thead hlmTableHeader class="bg-muted/50 border-b border-border">
          <tr hlmTableRow>
            @for (col of columns(); track col.key) {
              <th
                hlmTableHead
                [class.text-center]="col.align === 'center'"
                [class.text-right]="col.align === 'right'"
                class="font-semibold text-foreground"
              >
                {{ col.label }}
              </th>
            }
          </tr>
        </thead>

        <tbody hlmTableBody>
          @if (error()) {
            <tr hlmTableRow>
              <td hlmTableCell [attr.colspan]="columns().length" class="text-center">
                <div class="flex items-center justify-center gap-1 text-destructive">
                  <ng-icon name="hugeAlert01" />
                  <span class="text-sm text-muted-foreground">{{ error()!.message }}</span>
                </div>
              </td>
            </tr>
          } @else if (data().length === 0) {
            <tr hlmTableRow>
              <td
                hlmTableCell
                [attr.colspan]="columns().length"
                class="text-center text-muted-foreground bg-background/50"
              >
                No se encontraron registros en el sistema.
              </td>
            </tr>
          } @else {
            @for (row of data(); track $index) {
              <tr hlmTableRow>
                @for (col of columns(); track col.key) {
                  <td
                    hlmTableCell
                    [class.text-center]="col.align === 'center'"
                    [class.text-right]="col.align === 'right'"
                    [ngClass]="col.tdClass || ''"
                    class="align-middle"
                  >
                    <div [class.text-truncate]="col.truncate">
                      @if (col.customTemplate) {
                        <ng-container
                          *ngTemplateOutlet="col.customTemplate; context: { $implicit: row }"
                        ></ng-container>
                      } @else {
                        {{ $any(row)[col.key] }}
                      }
                    </div>
                  </td>
                }
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `,
})
export class DataTableComponent<T> {
  readonly data = input.required<T[]>();
  readonly columns = input.required<TableColumn<T>[]>();

  readonly error = input<UiErrorState | null>(null);
}
