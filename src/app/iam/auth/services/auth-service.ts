import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { environment } from '@envs/environment';
import {
  AuthResponse,
  AuthStep,
  IdentifyData,
  IdentifyResponse,
  LoginData,
  MailPurpose,
  SetupPasswordData,
  ValidatePasswordTokenData,
} from '../types/auth-types';
import { catchError, map, tap, throwError } from 'rxjs';

interface AuthFlow {
  step: AuthStep | 'EMAIL';
  mailPurpose?: MailPurpose;
}

type PasswordTokenStatus = 'CHECKING' | 'VALID' | 'INVALID';

const AUTH_API = `${environment.BASE_API}/v1/auth`;

@Service()
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  private readonly _authFlow = signal<AuthFlow>({ step: 'EMAIL' });
  private readonly _passwordTokenStatus = signal<PasswordTokenStatus>('CHECKING');
  private readonly _accessToken = signal<string | null>(null);

  public readonly step = computed(() => this._authFlow().step);
  public readonly isForgotPassword = computed(
    () =>
      this._authFlow().step === 'CHECK_MAIL' && this._authFlow().mailPurpose === 'RESET_PASSWORD',
  );
  public readonly passwordTokenStatus = this._passwordTokenStatus.asReadonly();
  public readonly accessToken = this._accessToken.asReadonly();

  private setupAuth({ accessToken }: AuthResponse) {
    this._accessToken.set(accessToken);
  }

  public indentify(data: IdentifyData) {
    const url = `${AUTH_API}/identify`;
    return this.httpClient.post<IdentifyResponse>(url, data).pipe(
      map(({ nextStep }) => {
        const mailPurpose = nextStep === 'CHECK_MAIL' ? 'SET_PASSWORD' : undefined;
        this._authFlow.set({
          step: nextStep,
          mailPurpose,
        });
      }),
    );
  }

  public login(data: LoginData) {
    const url = `${AUTH_API}/login`;
    return this.httpClient
      .post<AuthResponse>(url, data)
      .pipe(map((response) => this.setupAuth(response)));
  }

  public requestForgotPasswordMail() {
    const url = `${AUTH_API}/password/forgot`;
    return this.httpClient.post<void>(url, null).pipe(
      tap(() => {
        this._authFlow.set({
          step: 'CHECK_MAIL',
          mailPurpose: 'RESET_PASSWORD',
        });
      }),
    );
  }

  public validatePasswordToken(data: ValidatePasswordTokenData) {
    const url = `${AUTH_API}/password/token/validate`;
    return this.httpClient.post<void>(url, data).pipe(
      map(() => this._passwordTokenStatus.set('VALID')),
      catchError((error) => {
        this._passwordTokenStatus.set('INVALID');
        return throwError(() => error);
      }),
    );
  }

  public setupPassword(data: SetupPasswordData) {
    const url = `${AUTH_API}/password/setup`;
    return this.httpClient.post<AuthResponse>(url, data).pipe(
      map((response) => this.setupAuth(response)),
      catchError((error) => {
        this._passwordTokenStatus.set('INVALID');
        return throwError(() => error);
      }),
    );
  }

  public refresh() {
    const url = `${AUTH_API}/refresh`;
    return this.httpClient
      .post<AuthResponse>(url, null)
      .pipe(map((response) => this.setupAuth(response)));
  }
}
