import { Permission } from '../../permissions/types/permission-types';

export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: Permission[];
}
