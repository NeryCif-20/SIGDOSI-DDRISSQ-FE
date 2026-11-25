import { Component, computed, input } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { USER_STATUS_LABELS, UserStatus } from '../../types/user-types';
import { twMerge } from 'tailwind-merge';

const USERS_STATUS_CLASSES: Record<UserStatus, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
  ACTIVE: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  DISABLED: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
};

@Component({
  imports: [HlmBadgeImports],
  selector: 'sigdosi-user-status-badge',
  styles: ``,
  templateUrl: './user-status-badge.html',
})
export class UserStatusBadge {
  public readonly status = input.required<UserStatus>();
  public readonly classes = input<string>();

  protected readonly label = computed(() => USER_STATUS_LABELS[this.status()]);
  protected readonly finalClasses = computed(() =>
    twMerge('rounded-sm', USERS_STATUS_CLASSES[this.status()], this.classes()),
  );
}
