import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpErrorService } from '../../shared/services/http-error-service';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const httpErrorService = inject(HttpErrorService);
  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        httpErrorService.handle(error);
      }
      return throwError(() => error);
    }),
  );
};
