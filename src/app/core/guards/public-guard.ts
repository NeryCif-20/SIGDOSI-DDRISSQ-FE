import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../iam/auth/services/auth-service';

export const publicGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.status() === 'NOT_AUTHENTICATED' ? true : router.createUrlTree(['/']);
};
