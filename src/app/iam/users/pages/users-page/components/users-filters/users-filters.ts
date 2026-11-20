import { Component, model, output } from '@angular/core';
import { USER_STATUS_LABELS, USER_STATUS_OPTIONS, UserStatus } from '../../../../types/user-types';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { SearchInput } from '../../../../../../shared/components/search-input/search-input';
import { lucideFilterX } from '@ng-icons/lucide';
import { RoleSelector } from '../../../../../roles/components/role-selector/role-selector';

@Component({
  imports: [HlmComboboxImports, HlmButtonImports, NgIcon, SearchInput, RoleSelector],
  selector: 'sigdosi-users-filters',
  styles: ``,
  templateUrl: './users-filters.html',
  providers: [provideIcons({ lucideFilterX })],
})
export class UsersFilters {
  public readonly searchTerm = model.required<string>();
  public readonly selectedStatuses = model.required<UserStatus[]>();
  public readonly selectedRoles = model.required<string[]>();

  public readonly cleanFilters = output();

  protected readonly options = USER_STATUS_OPTIONS;

  protected getStatusLabel(status: UserStatus) {
    return USER_STATUS_LABELS[status];
  }
}
