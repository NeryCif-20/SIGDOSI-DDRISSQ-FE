export type PermissionAction = 'CREATE' | 'READ' | 'DELETE' | 'UPDATE';

export interface Permission {
  id: string;
  module: string;
  action: PermissionAction;
}
