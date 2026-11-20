import { Role, RoleData, RoleQueryParams } from '../types/role-types';

export function toRoleData({ name, description, permissions }: Role): RoleData {
  return {
    name,
    description: description ?? '',
    permissions: permissions.map((permission) => permission.id),
  };
}

export function toRole({ name, description, permissions }: Partial<RoleData>) {
  return {
    name,
    description: description || null,
    permissions,
  };
}

export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (filters: RoleQueryParams) => [...roleKeys.lists(), filters] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
};
