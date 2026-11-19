import { Component, computed, inject } from '@angular/core';
import { RolesHeader } from './components/roles-header/roles-header';
import { RolesFilters } from './components/roles-filters/roles-filters';
import {
  arrayParam,
  injectQueryParams,
  intParam,
  stringParam,
} from '../../../../shared/utils/inject-query-params';
import { RolesTable } from './components/roles-table/roles-table';
import { RoleApiService } from '../../services/role-api-service';
import { createEmptyPage } from '../../../../shared/utils/pagination-util';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { injectQuery } from '@tanstack/angular-query';
import { firstValueFrom } from 'rxjs';
import { roleKeys } from '../../utils/role-util';

const PAGE_SIZES = [10, 20, 50, 100];

@Component({
  imports: [RolesHeader, RolesFilters, RolesTable, Pagination],
  selector: 'sigdosi-roles-page',
  styles: ``,
  templateUrl: './roles-page.html',
})
export default class RolesPage {
  protected readonly pageSizes = PAGE_SIZES;

  private readonly roleApiService = inject(RoleApiService);
  private readonly queryParams = injectQueryParams({
    search: stringParam(''),
    permissions: arrayParam(),
    sort: arrayParam(),
    page: intParam(1),
    size: intParam(this.pageSizes[0], this.pageSizes[0], this.pageSizes.at(-1)),
  });

  protected readonly filters = computed(() => this.queryParams.state());

  protected readonly query = injectQuery(() => {
    const filters = { ...this.filters() };
    return {
      queryKey: roleKeys.list(filters),
      queryFn: () => firstValueFrom(this.roleApiService.getAll(filters)),
      placeholderData: (previousData) =>
        previousData ?? createEmptyPage(filters.page, filters.size),
      staleTime: 1000 * 60 * 5,
    };
  });

  protected onSearchTermChange(search: string) {
    this.queryParams.patch({ search });
  }

  protected onSelectedPermissionsChange(permissions: string[]) {
    this.queryParams.patch({ permissions });
  }

  protected onCleanFilters() {
    this.queryParams.patch({ search: '', permissions: [] });
  }

  protected onSortValuesChange(sort: string[]) {
    this.queryParams.patch({ sort });
  }

  protected onCurrentPageChange(page: number) {
    this.queryParams.patch({ page });
  }

  protected onElementsPerPageChange(size: number) {
    this.queryParams.patch({ size });
  }
}
