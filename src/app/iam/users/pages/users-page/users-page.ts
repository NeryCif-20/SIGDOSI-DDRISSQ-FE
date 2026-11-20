import { Component, computed, inject } from '@angular/core';
import { UsersHeader } from './components/users-header/users-header';
import { UsersFilters } from './components/users-filters/users-filters';
import {
  arrayParam,
  injectQueryParams,
  intParam,
  stringParam,
} from '../../../../shared/utils/inject-query-params';
import { USER_STATUSES, UserStatus } from '../../types/user-types';
import { injectQuery } from '@tanstack/angular-query';
import { userKeys } from '../../utils/user-util';
import { UserApiService } from '../../services/user-api-service';
import { firstValueFrom } from 'rxjs';
import { createEmptyPage } from '../../../../shared/utils/pagination-util';
import { Pagination } from '../../../../shared/components/pagination/pagination';

const PAGE_SIZES = [10, 20, 50, 100];

@Component({
  imports: [UsersHeader, UsersFilters, Pagination],
  selector: 'sigdosi-users-page',
  styles: ``,
  templateUrl: './users-page.html',
})
export class UsersPage {
  protected readonly pageSizes = PAGE_SIZES;

  private readonly userApiService = inject(UserApiService);
  private readonly queryParams = injectQueryParams({
    search: stringParam(''),
    statuses: arrayParam(USER_STATUSES),
    sort: arrayParam(),
    roles: arrayParam(),
    page: intParam(1),
    size: intParam(this.pageSizes[0], this.pageSizes[0], this.pageSizes.at(-1)),
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
    this.queryParams.patch({ search });
  }

  protected onSelectedStatusesChange(statuses: UserStatus[]) {
    this.queryParams.patch({ statuses });
  }

  protected onSelectedRolesChange(roles: string[]) {
    this.queryParams.patch({ roles });
  }

  protected onCleanFilters() {
    this.queryParams.patch({ search: '', statuses: [], roles: [] });
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
