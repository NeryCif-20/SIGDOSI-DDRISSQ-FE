import { Component, model, output } from '@angular/core';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import {
  PERMISSION_ACTION_LABELS,
  PERMISSION_ACTION_OPTIONS,
  PermissionAction,
} from '../../../../types/permission-types';
import { SearchInput } from '../../../../../../shared/components/search-input/search-input';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilterX } from '@ng-icons/lucide';

@Component({
  imports: [
    HlmInputGroupImports,
    HlmInputImports,
    HlmComboboxImports,
    HlmButtonImports,
    NgIcon,
    SearchInput,
  ],
  selector: 'sigdosi-permissions-filters',
  styles: ``,
  templateUrl: './permissions-filters.html',
  providers: [provideIcons({ lucideFilterX })],
})
export class PermissionsFilters {
  public readonly searchTerm = model.required<string>();
  public readonly selectedActions = model.required<PermissionAction[]>();

  public readonly cleanFilters = output();

  protected readonly options = PERMISSION_ACTION_OPTIONS;

  protected getActionLabel(action: PermissionAction) {
    return PERMISSION_ACTION_LABELS[action];
  }
}
