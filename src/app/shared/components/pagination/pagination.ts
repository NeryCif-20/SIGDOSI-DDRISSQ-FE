import { Component, computed, input, model, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsLeft,
  lucideChevronsRight,
} from '@ng-icons/lucide';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  imports: [HlmTypographyImports, HlmSelectImports, HlmSeparatorImports, NgIcon, HlmButtonImports],
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
  public readonly elementsPerPage = model.required<number>();
  public readonly totalElements = input.required<number>();
  public readonly pageSizes = input.required<readonly number[]>();

  public readonly currentPageChange = output<number>();

  protected readonly totalPages = computed(() =>
    Math.ceil(this.totalElements() / this.elementsPerPage()),
  );

  protected readonly range = computed(() => {
    const currentPage = this.currentPage();
    const pages = this.totalPages();
    if (pages <= 0) return [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(pages, currentPage + 1);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  });
}
