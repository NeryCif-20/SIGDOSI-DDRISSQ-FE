import { inject, Service, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';
import { AuthApiService } from '../../../services/auth-api-service';

type PasswordTokenStatus = 'VALID' | 'INVALID' | 'CHECKING';

@Service({ autoProvided: false })
export class SetupPasswordStore {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authApiService = inject(AuthApiService);

  private readonly _tokenStatus = signal<PasswordTokenStatus>('CHECKING');

  public readonly tokenStatus = this._tokenStatus.asReadonly();

  public readonly token = toSignal(
    this.activatedRoute.queryParamMap.pipe(map((params) => params.get('token')!)),
    {
      requireSync: true,
    },
  );

  public validatePasswordToken() {
    return this.authApiService.validatePasswordToken({ token: this.token() }).pipe(
      map(() => this._tokenStatus.set('VALID')),
      catchError((error) => {
        this._tokenStatus.set('INVALID');
        return throwError(() => error);
      }),
    );
  }

  public markTokenAsInvalid() {
    this._tokenStatus.set('INVALID');
  }
}
