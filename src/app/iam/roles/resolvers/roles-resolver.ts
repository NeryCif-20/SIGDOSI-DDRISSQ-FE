import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { QueryClient } from '@tanstack/angular-query';
import { RoleApiService } from '../services/role-api-service';
import { roleKeys } from '../utils/role-util';
import { firstValueFrom } from 'rxjs';
import { Page } from '../../../shared/types/pagination-types';
import { Role } from '../types/role-types';

export const rolesResolver: ResolveFn<Page<Role> | RedirectCommand> = async (_, state) => {
  const queryClient = inject(QueryClient);
  const roleApiService = inject(RoleApiService);
  const router = inject(Router);
  try {
    return await queryClient.query({
      queryKey: roleKeys.lists(),
      queryFn: () => firstValueFrom(roleApiService.getAll()),
    });
  } catch {
    return new RedirectCommand(
      router.createUrlTree(['/error'], {
        queryParams: { url: state.url },
      }),
    );
  }
};
