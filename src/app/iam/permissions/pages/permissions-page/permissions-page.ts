import { Component, computed, inject, linkedSignal } from '@angular/core';
import { PermissionsHeader } from './components/permissions-header/permissions-header';
import { PermissionsFilters } from './components/permissions-filters/permissions-filters';
import { PermissionApiService } from '../../services/permission-api-service';
import { Permission, PERMISSION_ACTIONS, PermissionAction } from '../../types/permission-types';
import { rxResource } from '@angular/core/rxjs-interop';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { PermissionsTable } from './components/permissions-table/permissions-table';
import { Page } from '../../../../shared/types/pagination-types';
import { createEmptyPage } from '../../../../shared/utils/pagination-util';
import {
  arrayParam,
  injectQueryParams,
  intParam,
  stringParam,
} from '../../../../shared/utils/inject-query-params';

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

  private readonly resource = rxResource({
    params: () => ({ filters: this.filters() }),
    stream: ({ params }) => this.permissionApiService.getAll(params.filters),
  });

  protected readonly response = linkedSignal<Page<Permission> | undefined, Page<Permission>>({
    source: () => this.resource.value(),
    computation: (current, previous) =>
      current ?? previous?.value ?? createEmptyPage(this.filters().page, this.filters().size),
  });

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
    console.log(page);
    this.queryParams.patch({ page });
  }

  protected onElementsPerPageChange(size: number) {
    this.queryParams.patch({ size });
  }
}
