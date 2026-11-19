import { Component, computed, effect, inject } from '@angular/core';
import { PermissionsHeader } from './components/permissions-header/permissions-header';
import { PermissionsFilters } from './components/permissions-filters/permissions-filters';
import { PermissionApiService } from '../../services/permission-api-service';
import { PERMISSION_ACTIONS, PermissionAction } from '../../types/permission-types';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { PermissionsTable } from './components/permissions-table/permissions-table';
import {
  arrayParam,
  injectQueryParams,
  intParam,
  stringParam,
} from '../../../../shared/utils/inject-query-params';
import { injectQuery } from '@tanstack/angular-query';
import { firstValueFrom } from 'rxjs';
import { createEmptyPage } from '../../../../shared/utils/pagination-util';

const PAGE_SIZES = [10, 20, 50, 100];

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
    sort: arrayParam(),
    page: intParam(1),
    size: intParam(this.pageSizes[0], this.pageSizes[0], this.pageSizes.at(-1)),
  });

  protected readonly filters = computed(() => this.queryParams.state());

  protected readonly query = injectQuery(() => {
    const filters = { ...this.filters() };
    return {
      queryKey: ['permissions', { ...filters }],
      queryFn: () => firstValueFrom(this.permissionApiService.getAll(filters)),
      placeholderData: (previousData) =>
        previousData ?? createEmptyPage(filters.page, filters.size),
      staleTime: 1000 * 60 * 5,
    };
  });

  constructor() {
    effect(() => console.log(this.query.data()));
  }

  protected onSearchTermChange(search: string) {
    this.queryParams.patch({ search });
  }

  protected onSelectedActionsChange(actions: PermissionAction[]) {
    this.queryParams.patch({ actions });
  }

  protected onCleanFilters() {
    this.queryParams.patch({ search: '', actions: [] });
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
