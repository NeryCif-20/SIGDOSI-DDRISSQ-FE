import { Component, computed, inject, input } from '@angular/core';
import { RolesHeader } from './components/roles-header/roles-header';
import { RolesFilters } from './components/roles-filters/roles-filters';
import { injectQueryParams } from '../../../../shared/utils/inject-query-params';
import { RolesTable } from './components/roles-table/roles-table';
import { RoleApiService } from '../../services/role-api-service';
import { createEmptyPage } from '../../../../shared/utils/pagination-util';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { injectQuery } from '@tanstack/angular-query';
import { firstValueFrom } from 'rxjs';
import { roleKeys } from '../../utils/role-util';
import { Page } from '../../../../shared/types/pagination-types';
import { Permission } from '../../../permissions/types/permission-types';
import { stringParam, arrayParam, intParam } from '../../../../shared/utils/query-param-codecs';
import { ROLE_SORT_VALUES, RoleSortValue } from '../../types/role-types';

const PAGE_SIZES = [1, 20, 50, 100];

const DEFAULT_PAGE = 1;

@Component({
  imports: [RolesHeader, RolesFilters, RolesTable, Pagination],
  selector: 'sigdosi-roles-page',
  styles: ``,
  templateUrl: './roles-page.html',
})
export default class RolesPage {
  public readonly permissions = input.required<Page<Permission>>();

  protected readonly pageSizes = PAGE_SIZES;

  private readonly roleApiService = inject(RoleApiService);

  private readonly allowedPermissions = computed(() =>
    this.permissions().content.map((permission) => permission.id),
  );

  private readonly queryParams = injectQueryParams({
    search: stringParam(''),
    permissions: arrayParam(() => this.allowedPermissions()),
    sort: arrayParam(ROLE_SORT_VALUES),
    page: intParam(DEFAULT_PAGE, { min: DEFAULT_PAGE }),
    size: intParam(this.pageSizes[0], { min: this.pageSizes[0], max: this.pageSizes.at(-1) }),
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
    this.queryParams.patch({ search, page: DEFAULT_PAGE });
  }

  protected onSelectedPermissionsChange(permissions: string[]) {
    this.queryParams.patch({ permissions, page: DEFAULT_PAGE });
  }

  protected onCleanFilters() {
    this.queryParams.patch({ search: '', permissions: [], page: DEFAULT_PAGE });
  }

  protected onSortValuesChange(sort: RoleSortValue[]) {
    this.queryParams.patch({ sort });
  }

  protected onCurrentPageChange(page: number) {
    this.queryParams.patch({ page });
  }

  protected onElementsPerPageChange(size: number) {
    this.queryParams.patch({ size });
  }
}
