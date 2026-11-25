import { Component, computed, inject, input } from '@angular/core';
import { UsersHeader } from './components/users-header/users-header';
import { UsersFilters } from './components/users-filters/users-filters';
import { injectQueryParams } from '../../../../shared/utils/inject-query-params';
import { USER_SORT_VALUES, USER_STATUSES, UserSortValue, UserStatus } from '../../types/user-types';
import { injectQuery } from '@tanstack/angular-query';
import { userKeys } from '../../utils/user-util';
import { UserApiService } from '../../services/user-api-service';
import { firstValueFrom } from 'rxjs';
import { createEmptyPage } from '../../../../shared/utils/pagination-util';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { stringParam, arrayParam, intParam } from '../../../../shared/utils/query-param-codecs';
import { Page } from '../../../../shared/types/pagination-types';
import { Role } from '../../../roles/types/role-types';
import { UsersTable } from './components/users-table/users-table';

const PAGE_SIZES = [10, 20, 50, 100];

const DEFAULT_PAGE = 1;

@Component({
  imports: [UsersHeader, UsersFilters, Pagination, UsersTable],
  selector: 'sigdosi-users-page',
  styles: ``,
  templateUrl: './users-page.html',
})
export class UsersPage {
  public readonly roles = input.required<Page<Role>>();

  protected readonly pageSizes = PAGE_SIZES;

  private readonly userApiService = inject(UserApiService);

  private readonly allowedRoles = computed(() => this.roles().content.map((role) => role.id));

  private readonly queryParams = injectQueryParams({
    search: stringParam(''),
    statuses: arrayParam(USER_STATUSES),
    sort: arrayParam(USER_SORT_VALUES),
    roles: arrayParam(() => this.allowedRoles()),
    page: intParam(DEFAULT_PAGE, { min: DEFAULT_PAGE }),
    size: intParam(this.pageSizes[0], { min: this.pageSizes[0], max: this.pageSizes.at(-1) }),
  });

  protected readonly filters = computed(() => this.queryParams.state());

  protected readonly query = injectQuery(() => {
    const filters = { ...this.filters() };
    return {
      queryKey: userKeys.list(filters),
      queryFn: () => firstValueFrom(this.userApiService.getAll(filters)),
      placeholderData: (previousData) =>
        previousData ?? createEmptyPage(filters.page, filters.size),
      staleTime: 1000 * 60 * 5,
    };
  });

  protected onSearchTermChange(search: string) {
    this.queryParams.patch({ search, page: DEFAULT_PAGE });
  }

  protected onSelectedStatusesChange(statuses: UserStatus[]) {
    this.queryParams.patch({ statuses, page: DEFAULT_PAGE });
  }

  protected onSelectedRolesChange(roles: string[]) {
    this.queryParams.patch({ roles, page: DEFAULT_PAGE });
  }

  protected onCleanFilters() {
    this.queryParams.patch({ search: '', statuses: [], roles: [], page: DEFAULT_PAGE });
  }

  protected onSortValuesChange(sort: UserSortValue[]) {
    this.queryParams.patch({ sort });
  }

  protected onCurrentPageChange(page: number) {
    this.queryParams.patch({ page });
  }

  protected onElementsPerPageChange(size: number) {
    this.queryParams.patch({ size });
  }
}
