import { Pageable } from '../../../shared/types/pagination-types';
import { Role } from '../../roles/types/role-types';

export const USER_STATUSES = ['ACTIVE', 'INACTIVE', 'PENDING'] as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  PENDING: 'Pendiente',
};

export interface UserData {
  email: string;
  status: UserStatus | null;
  cui: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  phoneNumber: string | null;
  role: string;
}

export interface User extends Omit<UserData, 'status' | 'role'> {
  id: string;
  status: UserStatus;
  role: Role;
}

export interface UserQueryParams extends Pageable {
  search?: string;
  statuses?: UserStatus[];
  roles?: string[];
}

export interface UserStatusOption {
  value: UserStatus;
  label: string;
}

export const USER_STATUS_OPTIONS: UserStatusOption[] = (
  Object.entries(USER_STATUS_LABELS) as [UserStatus, string][]
).map(([value, label]) => ({ value, label }));
