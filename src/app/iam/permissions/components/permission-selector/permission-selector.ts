import { Component, computed, inject, input, model, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideSearchX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { PermissionApiService } from '../../services/permission-api-service';
import {
  Permission,
  PermissionAction,
  PERMISSION_ACTION_LABELS,
} from '../../types/permission-types';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { SearchInput } from '../../../../shared/components/search-input/search-input';
import { firstValueFrom } from 'rxjs';
import { injectQuery } from '@tanstack/angular-query';
import { groupBy } from '../../../../shared/utils/arrays-util';
import { permissionKeys } from '../../utils/permission-util';
import { normalize } from '../../../../shared/utils/strings-util';

type SelectionState = 'all' | 'some' | 'none';

@Component({
  imports: [
    HlmDialogImports,
    HlmButtonImports,
    HlmFieldImports,
    HlmInputGroupImports,
    HlmInputImports,
    HlmCheckboxImports,
    SearchInput,
    NgIcon,
  ],
  selector: 'sigdosi-permission-selector',
  styles: ``,
  templateUrl: './permission-selector.html',
  providers: [provideIcons({ lucideEye, lucideSearchX })],
})
export class PermissionSelector {
  public readonly readonly = input<string | boolean>(false);
  public readonly openButtonText = input<string>('Seleccionar');
  public readonly closeButtonText = input<string>('Listo');
  public readonly selected = model<string[]>([]);

  private readonly permissionApiService = inject(PermissionApiService);

  protected readonly searchTerm = signal('');

  private readonly query = injectQuery(() => {
    return {
      queryKey: permissionKeys.lists(),
      queryFn: () => firstValueFrom(this.permissionApiService.getAll()),
    };
  });

  private readonly permissions = computed(() => {
    const search = normalize(this.searchTerm());
    const content = this.query.data()?.content ?? [];
    const values = search
      ? content.filter((permission) => normalize(permission.module).includes(search))
      : content;
    return groupBy(values, (permission) => permission.module);
  });

  protected readonly groups = computed(() =>
    Object.entries(this.permissions()).map(([module, items]) => ({
      module,
      items,
      state: this.moduleState(items),
    })),
  );

  protected isSelected(id: string) {
    return this.selected().includes(id);
  }

  protected toggle(id: string, checked: boolean) {
    this.selected.update((current) =>
      checked
        ? current.includes(id)
          ? current
          : [...current, id]
        : current.filter((value) => value !== id),
    );
  }

  protected toggleModule(permissions: Permission[], checked: boolean) {
    this.selected.update((current) => {
      const ids = permissions.map((permission) => permission.id);
      return checked
        ? [...new Set([...current, ...ids])]
        : current.filter((id) => !ids.includes(id));
    });
  }

  protected moduleState(permissions: Permission[]): SelectionState {
    const count = permissions.filter((permission) =>
      this.selected().includes(permission.id),
    ).length;
    if (count === 0) return 'none';
    return count === permissions.length ? 'all' : 'some';
  }

  protected getActionLabel(action: PermissionAction) {
    return PERMISSION_ACTION_LABELS[action];
  }
}
