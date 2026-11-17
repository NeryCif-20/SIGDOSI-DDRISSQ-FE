import { Component, model, output } from '@angular/core';
import { SearchInput } from '../../../../../../shared/components/search-input/search-input';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilterX } from '@ng-icons/lucide';
import { PermissionSelector } from '../../../../../permissions/components/permission-selector/permission-selector';

@Component({
  imports: [SearchInput, HlmButtonImports, NgIcon, PermissionSelector],
  selector: 'sigdosi-roles-filters',
  styles: ``,
  templateUrl: './roles-filters.html',
  providers: [provideIcons({ lucideFilterX })],
})
export class RolesFilters {
  public readonly searchTerm = model.required<string>();
  public readonly selectedPermissions = model.required<string[]>();

  public readonly cleanFilters = output();
}
