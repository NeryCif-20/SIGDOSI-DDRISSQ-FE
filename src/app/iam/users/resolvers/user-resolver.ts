import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { QueryClient } from '@tanstack/angular-query';
import { UserApiService } from '../services/user-api-service';
import { firstValueFrom } from 'rxjs';
import { userKeys } from '../utils/user-util';
import { User } from '../types/user-types';
import { UUID_V7_PATTERN } from '../../../shared/validations/patterns';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

export const userResolver: ResolveFn<User | RedirectCommand> = async (route, state) => {
  const userApiService = inject(UserApiService);
  const router = inject(Router);
  const queryClient = inject(QueryClient);
  const id = route.paramMap.get('id');
  if (!id || !UUID_V7_PATTERN.test(id)) {
    return new RedirectCommand(router.createUrlTree(['/users']));
  }
  try {
    return await queryClient.query({
      queryKey: userKeys.detail(id!),
      queryFn: () => firstValueFrom(userApiService.get(id!)),
    });
  } catch (error: unknown) {
    if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.NotFound) {
      return new RedirectCommand(router.createUrlTree(['/users']));
    }
    return new RedirectCommand(
      router.createUrlTree(['/error'], { queryParams: { url: state.url } }),
    );
  }
};
