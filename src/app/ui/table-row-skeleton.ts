import { Component, computed, input } from '@angular/core';
import { HlmSkeletonImports } from '@ui-spartan/skeleton';
import { HlmTableImports } from '@ui-spartan/table';

export interface SkeletonColumn {
  class?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
}

@Component({
  selector: 'app-table-row-skeleton',
  imports: [HlmSkeletonImports, HlmTableImports],
  host: {
    style: 'display: contents;',
  },
  template: `
    @for (row of rowsArray(); track $index) {
      <tr hlmTableRow>
        @for (col of columns(); track $index) {
          <td hlmTableCell [class]="col.class" [attr.align]="col.align">
            <hlm-skeleton class="h-6 rounded-lg w-full" />
          </td>
        }
      </tr>
    }
  `,
})
export default class TableRowSkeleton {
  rows = input<number>(5);
  columns = input<SkeletonColumn[], number | SkeletonColumn[]>([{}, {}, {}, {}], {
    transform: (value: number | SkeletonColumn[]): SkeletonColumn[] => {
      if (typeof value === 'number') {
        return Array(value).fill({});
      }
      return value;
    },
  });
  rowsArray = computed(() => Array(this.rows()).fill(0));
}
