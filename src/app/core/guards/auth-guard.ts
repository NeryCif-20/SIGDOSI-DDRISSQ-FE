import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../iam/auth/services/auth-service';

export const authGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.status() === 'AUTHENTICATED' ? true : router.createUrlTree(['/auth/login']);
};
