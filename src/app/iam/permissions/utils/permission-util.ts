import {
  PERMISSION_ACTION_LABELS,
  PERMISSION_ACTIONS,
  PermissionAction,
  PermissionQueryParams,
} from '../types/permission-types';

export function isValidPermissionAction(value: unknown): value is PermissionAction {
  return PERMISSION_ACTIONS.includes(value as PermissionAction);
}

export function actionToString(action: PermissionAction) {
  return PERMISSION_ACTION_LABELS[action];
}

export const permissionKeys = {
  all: ['permissions'] as const,
  lists: () => [...permissionKeys.all, 'list'] as const,
  list: (filters: PermissionQueryParams) => [...permissionKeys.lists(), filters] as const,
  details: () => [...permissionKeys.all, 'detail'] as const,
  detail: (id: string) => [...permissionKeys.details(), id] as const,
};
