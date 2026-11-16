import { Component, computed, effect, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsLeft,
  lucideChevronsRight,
} from '@ng-icons/lucide';
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
  imports: [
    HlmPaginationImports,
    HlmTypographyImports,
    HlmSelectImports,
    HlmSeparatorImports,
    NgIcon,
  ],
  selector: 'sigdosi-pagination',
  styles: ``,
  templateUrl: './pagination.html',
  providers: [
    provideIcons({
      lucideChevronsLeft,
      lucideChevronLeft,
      lucideChevronRight,
      lucideChevronsRight,
    }),
  ],
})
export class Pagination {
  public readonly currentPage = input.required<number>();
  public readonly elementsPerPage = input.required<number>();
  public readonly totalElements = input.required<number>();
  public readonly pageSizes = input.required<number[]>();

  public readonly currentPageChange = output<number>();
  public readonly elementsPerPageChange = output<number>();

  protected readonly pages = computed(() =>
    Math.ceil(this.totalElements() / this.elementsPerPage()),
  );

  protected readonly range = computed(() => {
    const currentPage = this.currentPage();
    const pages = this.pages();
    if (pages <= 0) return [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(pages, currentPage + 1);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  });

  constructor() {
    effect(() => {
      const pages = this.pages();
      if (pages > 0 && this.currentPage() > pages) {
        this.currentPageChange.emit(pages);
      }
    });
  }
}
