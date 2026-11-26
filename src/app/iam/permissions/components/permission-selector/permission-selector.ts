import { Component, computed, inject, input, model, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideSearchX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { SearchInput } from '../../../../shared/components/search-input/search-input';
import { QueryClient } from '@tanstack/angular-query';
import { permissionKeys } from '../../queries/permission-keys';
import {
  Permission,
  PERMISSION_ACTION_LABELS,
  PermissionAction,
  PermissionGroup,
} from '../../types/permission-types';
import { normalize } from '../../../../shared/utils/strings-util';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { TitleCasePipe } from '@angular/common';
import { Page } from '../../../../shared/types/pagination-types';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

type CheckState = 'none' | 'all' | 'some';

@Component({
  imports: [
    HlmDialogImports,
    HlmButtonImports,
    HlmCheckboxImports,
    HlmLabelImports,
    HlmTooltipImports,
    TitleCasePipe,
    SearchInput,
    NgIcon,
  ],
  selector: 'sigdosi-permission-selector',
  styles: ``,
  templateUrl: './permission-selector.html',
  providers: [provideIcons({ lucideEye, lucideSearchX })],
})
export class PermissionSelector {
  public readonly readonly = input<boolean>(false);
  public readonly tooltip = input<boolean>(false);
  public readonly openButtonText = input('Seleccionar...');
  public readonly closeButtonText = input('Cerrar');
  public readonly selectedIds = model<string[]>([]);

  private readonly queryClient = inject(QueryClient);
  private readonly query = this.queryClient.getQueryData<Page<Permission>>(permissionKeys.lists());

  private readonly groups = computed<PermissionGroup[]>(() => {
    const permissions = this.query?.content ?? [];
    const groups = new Map<string, Permission[]>();
    for (const permission of permissions) {
      const group = groups.get(permission.module) ?? [];
      group.push(permission);
      groups.set(permission.module, group);
    }
    return Array.from(groups, ([key, permissions]) => ({
      module: normalize(key),
      permissions,
    }));
  });

  protected readonly searchTerm = signal('');
  protected readonly description = computed(() =>
    this.readonly() ? 'Visualiza los seleccionados' : 'Selecciona los que necesites...',
  );
  protected readonly selectedSet = computed(() => new Set(this.selectedIds()));
  protected readonly filteredGroups = computed(() => {
    const term = normalize(this.searchTerm());
    return term ? this.groups().filter((group) => group.module.includes(term)) : this.groups();
  });
  protected readonly tooltipDisabled = computed(() => !(this.tooltip() && this.readonly()));

  protected toggle(id: string) {
    this.selectedIds.update((values) =>
      values.includes(id) ? values.filter((value) => value !== id) : [...values, id],
    );
  }

  protected toggleGroup(group: PermissionGroup) {
    const groupIds = group.permissions.map((permission) => permission.id);
    const allSelected = groupIds.every((value) => this.selectedSet().has(value));
    this.selectedIds.update((values) =>
      allSelected
        ? values.filter((id) => !groupIds.includes(id))
        : [...new Set([...values, ...groupIds])],
    );
  }

  protected deriveState(group: PermissionGroup): CheckState {
    const selected = this.selectedSet();
    const permissions = group.permissions;
    const count = permissions.filter((permission) => selected.has(permission.id)).length;
    return !count ? 'none' : count === permissions.length ? 'all' : 'some';
  }

  protected resolveActionLabel(action: PermissionAction) {
    return PERMISSION_ACTION_LABELS[action];
  }
}
