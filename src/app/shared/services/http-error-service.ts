import { HttpErrorResponse } from '@angular/common/http';
import { Service } from '@angular/core';
import { ApiErrorResponse } from '../types/error-types';
import { toast } from '@spartan-ng/brain/sonner';

@Service()
export class HttpErrorService {
  public handle(error: HttpErrorResponse) {
    const { title, detail } = error.error as ApiErrorResponse;
    toast.error(title, {
      description: detail,
    });
  }
}
