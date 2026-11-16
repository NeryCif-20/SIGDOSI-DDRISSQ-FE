import { Component, computed } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpDown, lucideSortAsc, lucideSortDesc } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { FlexRender, injectTableHeaderContext } from '@tanstack/angular-table';

@Component({
  imports: [HlmButtonImports, FlexRender, NgIcon],
  selector: 'sigdosi-table-sort-indicator',
  styles: ``,
  templateUrl: './table-sort-indicator.html',
  providers: [provideIcons({ lucideArrowUpDown, lucideSortAsc, lucideSortDesc })],
})
export class TableSortIndicator {
  protected readonly header = injectTableHeaderContext();

  protected readonly icon = computed(() => {
    const isSorted = this.header().column.getIsSorted();
    switch (isSorted) {
      case 'asc':
        return 'lucideSortAsc';
      case 'desc':
        return 'lucideSortDesc';
      default:
        return 'lucideArrowUpDown';
    }
  });
}
