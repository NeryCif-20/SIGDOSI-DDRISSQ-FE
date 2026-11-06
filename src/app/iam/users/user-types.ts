import { Role } from '../roles/types/role-types';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface User {
  id: string;
  email: string;
  status: UserStatus;
  cui: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  phoneNumber: string | null;
  role: Role;
}
