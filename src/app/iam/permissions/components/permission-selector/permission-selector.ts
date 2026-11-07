import { Component, inject, model, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { PermissionApiService } from '../../services/permission-api-service';
import { catchError, distinctUntilChanged, map, of, switchMap, timer } from 'rxjs';
import { groupBy } from '../../../../shared/utils/arrays-util';
import {
  Permission,
  PermissionAction,
  PERMISSION_ACTION_LABELS,
} from '../../types/permission-types';
import { KeyValuePipe } from '@angular/common';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';

type PermissionsByModule = Record<string, Permission[]>;

type PermissionsByModuleState = 'all' | 'some' | 'none';

@Component({
  imports: [
    HlmDialogImports,
    HlmButtonImports,
    HlmFieldImports,
    HlmInputGroupImports,
    HlmInputImports,
    NgIcon,
    KeyValuePipe,
    HlmCheckboxImports,
  ],
  selector: 'sigdosi-permission-selector',
  styles: ``,
  templateUrl: './permission-selector.html',
  providers: [provideIcons({ lucideSearch })],
})
export class PermissionSelector {
  public readonly selected = model<ReadonlySet<string>>(new Set());

  private readonly permissionApiService = inject(PermissionApiService);

  protected readonly q = signal('');

  protected readonly permissions = toSignal(
    toObservable(this.q).pipe(
      switchMap((q, index) => (index === 0 ? of(q) : timer(500).pipe(map(() => q)))),
      distinctUntilChanged(),
      switchMap((q) => this.permissionApiService.getAll({ q })),
      map(({ content }) => groupBy(content, (permission) => permission.module)),
      catchError(() => of({} as PermissionsByModule)),
    ),
    {
      initialValue: {} as PermissionsByModule,
    },
  );

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

  protected moduleState(permissions: Permission[]): PermissionsByModuleState {
    const count = permissions.filter((permission) => this.selected().has(permission.id)).length;
    if (count === 0) return 'none';
    return count === permissions.length ? 'all' : 'some';
  }

  protected getActionLabel(action: PermissionAction) {
    return PERMISSION_ACTION_LABELS[action];
  }
}
