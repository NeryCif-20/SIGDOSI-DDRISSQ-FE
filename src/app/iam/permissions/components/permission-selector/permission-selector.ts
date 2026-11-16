import { Component, inject, linkedSignal, model, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
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
  ],
  selector: 'sigdosi-permission-selector',
  styles: ``,
  templateUrl: './permission-selector.html',
  providers: [provideIcons({ lucideSearch })],
})
export class PermissionSelector {
  public readonly selected = model<ReadonlySet<string>>(new Set());

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
    return this.selected().has(id);
  }

  protected toggle(id: string, checked: boolean) {
    this.selected.update((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  protected toggleModule(permissions: Permission[], checked: boolean) {
    this.selected.update((prev) => {
      const next = new Set(prev);
      for (const permission of permissions) {
        if (checked) {
          next.add(permission.id);
        } else {
          next.delete(permission.id);
        }
      }
      return next;
    });
  }

  protected moduleState(permissions: Permission[]): SelectionState {
    const count = permissions.filter((permission) => this.selected().has(permission.id)).length;
    if (count === 0) return 'none';
    return count === permissions.length ? 'all' : 'some';
  }

  protected getActionLabel(action: PermissionAction) {
    return PERMISSION_ACTION_LABELS[action];
  }
}
