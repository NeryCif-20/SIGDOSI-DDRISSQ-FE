import { Component, inject, input, linkedSignal, model, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye } from '@ng-icons/lucide';
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
import { KeyValuePipe } from '@angular/common';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { SearchInput } from '../../../../shared/components/search-input/search-input';
import { map } from 'rxjs';
import { groupBy } from '../../../../shared/utils/arrays-util';

type SelectionState = 'all' | 'some' | 'none';

@Component({
  imports: [
    HlmDialogImports,
    HlmButtonImports,
    HlmFieldImports,
    HlmInputGroupImports,
    HlmInputImports,
    KeyValuePipe,
    HlmCheckboxImports,
    SearchInput,
    NgIcon,
  ],
  selector: 'sigdosi-permission-selector',
  styles: ``,
  templateUrl: './permission-selector.html',
  providers: [provideIcons({ lucideEye })],
})
export class PermissionSelector {
  public readonly readonly = input<string | boolean>(false);
  public readonly openButtonText = input<string>('Seleccionar');
  public readonly closeButtonText = input<string>('Listo');
  public readonly selected = model<string[]>([]);

  private readonly permissionApiService = inject(PermissionApiService);

  protected readonly searchTerm = signal('');

  private readonly resource = rxResource({
    params: () => ({ search: this.searchTerm() }),
    stream: ({ params }) =>
      this.permissionApiService
        .getAll({ search: params.search })
        .pipe(map((response) => groupBy(response.content, (permission) => permission.module))),
  });

  protected readonly permissions = linkedSignal<
    Record<string, Permission[]> | undefined,
    Record<string, Permission[]>
  >({
    source: () => this.resource.value(),
    computation: (current, previous) => current ?? previous?.value ?? {},
  });

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
