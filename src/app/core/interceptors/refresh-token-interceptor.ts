import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../iam/auth/services/auth-service';
import { catchError, switchMap, throwError } from 'rxjs';
import { ApiErrorResponse } from '../../shared/types/error-types';

const TOKEN_EXPIRED = 'TOKEN_EXPIRED';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  return next(req).pipe(
    catchError((error) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }
      const { code, status } = error.error as ApiErrorResponse;
      if (code !== TOKEN_EXPIRED || status !== 401) {
        return throwError(() => error);
      }
      return authService.refresh().pipe(switchMap(() => next(req)));
    }),
  );
};
