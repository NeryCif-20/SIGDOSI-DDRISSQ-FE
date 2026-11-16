import { Component, computed, input } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { PERMISSION_ACTION_LABELS, PermissionAction } from '../../../../types/permission-types';

const PERMISSION_ACTION_CLASSES: Record<PermissionAction, string> = {
  CREATE: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  UPDATE: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  READ: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  DELETE: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
};

@Component({
  imports: [HlmBadgeImports],
  selector: 'sigdosi-permissions-action-cell',
  styles: ``,
  templateUrl: './permissions-action-cell.html',
})
export class PermissionsActionCell {
  public readonly action = input.required<PermissionAction>();

  protected readonly label = computed(() => PERMISSION_ACTION_LABELS[this.action()]);
  protected readonly classes = computed(() => PERMISSION_ACTION_CLASSES[this.action()]);
}
