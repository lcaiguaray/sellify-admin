import { Component, computed, input, output } from '@angular/core';
import { HlmPaginationImports } from './spartan/pagination/src';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeArrowLeft01, hugeArrowRight01 } from '@ng-icons/huge-icons';
import { HlmButtonImports } from './spartan/button/src';
import { HlmSelectImports } from './spartan/select/src';

@Component({
  selector: 'app-pagination',
  imports: [NgIcon, HlmPaginationImports, HlmButtonImports, HlmSelectImports],
  providers: [provideIcons({ hugeArrowLeft01, hugeArrowRight01 })],
  host: {
    class: 'w-full',
  },
  template: `
    <nav class="flex items-center justify-between px-2">
      <div>
        <hlm-select
          [itemToString]="itemToString"
          [value]="pageSize().toString()"
          (valueChange)="onPageSizeChange($event)"
        >
          <hlm-select-trigger>
            <hlm-select-value placeholder="Registros" class="text-xs" />
          </hlm-select-trigger>
          <hlm-select-content *hlmSelectPortal>
            <hlm-select-group>
              <hlm-select-label>Registros</hlm-select-label>
              @for (size of pageSizes(); track size) {
                <hlm-select-item [value]="size.toString()" class="text-xs"
                  >{{ size }} / page</hlm-select-item
                >
              }
            </hlm-select-group>
          </hlm-select-content>
        </hlm-select>
      </div>

      <div class="flex items-center gap-1">
        <button
          hlmBtn
          variant="outline"
          size="icon-sm"
          (click)="onPrevPage()"
          [disabled]="!hasPreviousPage()"
        >
          <ng-icon name="hugeArrowLeft01" />
        </button>

        <span class="text-xs text-muted-foreground mx-2">
          Pág {{ currentPage() }} de {{ totalPages() }}
        </span>

        <button
          hlmBtn
          variant="outline"
          size="icon-sm"
          (click)="onNextPage()"
          [disabled]="!hasNextPage()"
        >
          <ng-icon name="hugeArrowRight01" />
        </button>
      </div>
    </nav>
  `,
})
export class Pagination {
  pageSizes = input<number[]>([10, 25, 50, 100]);
  pageSize = input<number>(10);
  currentPage = input<number>(1);
  totalPages = input<number>(0);

  pageChanged = output<number>();
  pageSizeChanged = output<number>();

  hasPreviousPage = computed(() => this.currentPage() > 1);
  hasNextPage = computed(() => this.currentPage() < this.totalPages());

  public readonly itemToString = (value: string) => {
    return (
      (this.pageSizes()
        .find((item) => item === parseInt(value, 10))
        ?.toString() || '0') + ' / page'
    );
  };

  onPrevPage(): void {
    if (this.hasPreviousPage()) {
      this.pageChanged.emit(this.currentPage() - 1);
    }
  }

  onNextPage(): void {
    if (this.hasNextPage()) {
      this.pageChanged.emit(this.currentPage() + 1);
    }
  }

  onPageSizeChange(newSizeStr: string | null | undefined): void {
    const newSize = typeof newSizeStr === 'string' ? parseInt(newSizeStr, 10) : newSizeStr;
    if (newSize && newSize !== this.pageSize()) {
      this.pageSizeChanged.emit(newSize);
    }
  }
}
