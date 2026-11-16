import {
  PERMISSION_ACTION_LABELS,
  PERMISSION_ACTIONS,
  PermissionAction,
} from '../types/permission-types';

export function isValidPermissionAction(value: unknown): value is PermissionAction {
  return PERMISSION_ACTIONS.includes(value as PermissionAction);
}

export function actionToString(action: PermissionAction) {
  return PERMISSION_ACTION_LABELS[action];
}
