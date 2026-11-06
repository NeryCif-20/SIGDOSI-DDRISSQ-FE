import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../iam/auth/services/auth-service';

export const addAccessTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  if (authService.accessToken()) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authService.accessToken()}`),
    });
    return next(clonedReq);
  }
  return next(req);
};
