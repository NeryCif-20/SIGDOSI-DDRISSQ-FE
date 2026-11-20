import { permissionKeys as usersKeys } from '../../permissions/utils/permission-util';
import { UserQueryParams } from '../types/user-types';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (filters: UserQueryParams) => [...usersKeys.lists(), filters] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
};
