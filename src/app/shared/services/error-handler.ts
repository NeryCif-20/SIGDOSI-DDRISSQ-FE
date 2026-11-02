import { HttpErrorResponse } from '@angular/common/http';
import { Service } from '@angular/core';
import { ApiErrorResponse } from '../types/error-types';
import { toast } from '@spartan-ng/brain/sonner';

@Service()
export class ErrorHandler {
  private handleHttpError(error: HttpErrorResponse) {
    const { title, detail } = error.error as ApiErrorResponse;
    toast.error(title, {
      description: detail,
    });
  }

  public handle(error: unknown) {
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
      return;
    }
    toast.error('Ocurrio un error inesperado');
  }
}
