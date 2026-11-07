import { Component, signal } from '@angular/core';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import {
  PERMISSION_ACTION_LABELS,
  PermissionAction,
  PermissionFilters,
} from '../../../../types/permission-types';
import { SearchInput } from '../../../../../../shared/components/search-input/search-input';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';
import { skip } from 'rxjs';

interface ActionLabelOption {
  value: PermissionAction;
  label: string;
}

const ACTION_LABELS_OPTIONS: ActionLabelOption[] = (
  Object.entries(PERMISSION_ACTION_LABELS) as [PermissionAction, string][]
).map(([value, label]) => ({
  value,
  label,
}));

@Component({
  imports: [HlmInputGroupImports, HlmInputImports, HlmSelectImports, SearchInput],
  selector: 'sigdosi-permissions-filters',
  styles: ``,
  templateUrl: './permissions-filters.html',
})
export class PermissionsFilters {
  private readonly filters = signal<PermissionFilters>({});

  public readonly filtersChange = outputFromObservable(toObservable(this.filters).pipe(skip(1)));

  protected readonly options = ACTION_LABELS_OPTIONS;
  protected readonly actionToString = (action: PermissionAction) =>
    PERMISSION_ACTION_LABELS[action];

  protected updateQ(q?: string) {
    this.filters.update((filters) => ({ ...filters, q }));
  }

  protected updateAction(action?: PermissionAction | null) {
    this.filters.update((filters) => ({ ...filters, action: action ?? undefined }));
  }
}
