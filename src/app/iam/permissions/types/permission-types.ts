export type PermissionAction = 'CREATE' | 'READ' | 'DELETE' | 'UPDATE';

export const PERMISSION_ACTION_LABELS: Record<PermissionAction, string> = {
  CREATE: 'Crear',
  READ: 'Ver',
  DELETE: 'Eliminar',
  UPDATE: 'Actualizar',
};

export interface PermissionData {
  module: string;
  action: PermissionAction;
}

export interface Permission extends PermissionData {
  id: string;
}

export interface PermissionFilters {
  q?: string;
  action?: PermissionAction;
}
