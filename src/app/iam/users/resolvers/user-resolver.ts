import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { QueryClient } from '@tanstack/angular-query';
import { UserApiService } from '../services/user-api-service';
import { firstValueFrom } from 'rxjs';
import { userKeys } from '../utils/user-util';

export const userResolver: ResolveFn<boolean> = (route) => {
  const userApiService = inject(UserApiService);
  const router = inject(Router);
  const queryClient = inject(QueryClient);
  const id = route.paramMap.get('id');
  try {
    return queryClient.query({
      queryKey: userKeys.detail(id!),
      queryFn: () => firstValueFrom(userApiService.get(id!)),
      staleTime: 'static',
    });
  } catch {
    return new RedirectCommand(router.createUrlTree(['/error']));
  }
};
