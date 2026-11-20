import { Pageable } from '../../../shared/types/pagination-types';

export const PERMISSION_ACTIONS = ['CREATE', 'READ', 'DELETE', 'UPDATE'] as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

export const PERMISSION_ACTION_LABELS: Record<PermissionAction, string> = {
  CREATE: 'Crear',
  READ: 'Ver',
  DELETE: 'Eliminar',
  UPDATE: 'Actualizar',
};

export interface PermissionData {
  module: string;
  action: null | PermissionAction;
}

export interface Permission {
  id: string;
  module: string;
  action: PermissionAction;
}

export interface PermissionQueryParams extends Pageable {
  search?: string;
  actions?: PermissionAction[];
}

export interface PermissionActionOption {
  value: PermissionAction;
  label: string;
}

export const PERMISSION_ACTION_OPTIONS: PermissionActionOption[] = (
  Object.entries(PERMISSION_ACTION_LABELS) as [PermissionAction, string][]
).map(([value, label]) => ({
  value,
  label,
}));
