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
  description: string | null;
  permissions: Permission[];
}

export interface RoleQueryParams extends Pageable {
  search?: string;
  permissions?: string[];
}

export const ROLE_SORT_VALUES = ['name,asc', 'name,desc'] as const;

export type RoleSortValue = (typeof ROLE_SORT_VALUES)[number];
