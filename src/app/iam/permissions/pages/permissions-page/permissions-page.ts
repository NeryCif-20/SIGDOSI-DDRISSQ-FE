import { Component, computed, inject } from '@angular/core';
import { PermissionsHeader } from './components/permissions-header/permissions-header';
import { PermissionsFilters } from './components/permissions-filters/permissions-filters';
import { PermissionApiService } from '../../services/permission-api-service';
import {
  PERMISSION_ACTIONS,
  PERMISSION_SORT_VALUES,
  PermissionAction,
  PermissionSortValue,
} from '../../types/permission-types';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { PermissionsTable } from './components/permissions-table/permissions-table';
import { injectQueryParams } from '../../../../shared/utils/inject-query-params';
import { injectQuery } from '@tanstack/angular-query';
import { firstValueFrom } from 'rxjs';
import { createEmptyPage } from '../../../../shared/utils/pagination-util';
import { permissionKeys } from '../../queries/permission-keys';
import { stringParam, arrayParam, intParam } from '../../../../shared/utils/query-param-codecs';

const PAGE_SIZES = [10, 20, 50, 100] as const;

const DEFAULT_PAGE = 1;

@Component({
  imports: [PermissionsHeader, PermissionsFilters, Pagination, PermissionsTable],
  selector: 'sigdosi-permissions-page',
  styles: ``,
  templateUrl: './permissions-page.html',
})
export default class PermissionsPage {
  protected readonly pageSizes = PAGE_SIZES;

  private readonly permissionApiService = inject(PermissionApiService);
  private readonly queryParams = injectQueryParams({
    search: stringParam(''),
    actions: arrayParam(PERMISSION_ACTIONS),
    sort: arrayParam(PERMISSION_SORT_VALUES),
    page: intParam(DEFAULT_PAGE, { min: 1 }),
    size: intParam(this.pageSizes[0], { min: this.pageSizes[0], max: this.pageSizes.at(-1) }),
  });

  protected readonly filters = computed(() => this.queryParams.state());

  protected readonly query = injectQuery(() => {
    const filters = { ...this.filters() };
    return {
      queryKey: permissionKeys.list(filters),
      queryFn: () => firstValueFrom(this.permissionApiService.getAll(filters)),
      placeholderData: (previousData) =>
        previousData ?? createEmptyPage(filters.page, filters.size),
      staleTime: 1000 * 60 * 5,
    };
  });

  protected setSearch(search: string) {
    this.queryParams.patch({ search, page: DEFAULT_PAGE });
  }

  protected setActions(actions: PermissionAction[]) {
    this.queryParams.patch({ actions, page: DEFAULT_PAGE });
  }

  protected onCleanFilters() {
    this.queryParams.patch({ search: '', actions: [], page: DEFAULT_PAGE });
  }

  protected setSort(sort: PermissionSortValue[]) {
    this.queryParams.patch({ sort });
  }

  protected setPage(page: number) {
    this.queryParams.patch({ page });
  }

  protected setSize(size: number) {
    this.queryParams.patch({ size });
  }
}
