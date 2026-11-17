import { Pageable } from '../../../shared/types/pagination-types';
import { Permission } from '../../permissions/types/permission-types';

export interface RoleData {
  name: string;
  description: string;
  permissions: string[];
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface RoleQueryParams extends Pageable {
  search?: string;
  permissions?: string[];
}
