import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { QueryClient } from '@tanstack/angular-query';
import { PermissionApiService } from '../services/permission-api-service';
import { firstValueFrom } from 'rxjs';
import { permissionKeys } from '../queries/permission-keys';
import { Page } from '../../../shared/types/pagination-types';
import { Permission } from '../types/permission-types';

export const permissionsResolver: ResolveFn<Page<Permission> | RedirectCommand> = async (
  _,
  state,
) => {
  const queryClient = inject(QueryClient);
  const permissionApiService = inject(PermissionApiService);
  const router = inject(Router);
  try {
    return await queryClient.query({
      queryKey: permissionKeys.lists(),
      queryFn: () => firstValueFrom(permissionApiService.getAll()),
    });
  } catch {
    return new RedirectCommand(
      router.createUrlTree(['/error'], {
        queryParams: { url: state.url },
      }),
    );
  }
};
