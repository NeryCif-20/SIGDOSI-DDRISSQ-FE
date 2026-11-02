import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { environment } from '@envs/environment';
import {
  AuthResponse,
  AuthStep,
  IdentifyData,
  IdentifyResponse,
  LoginData,
} from '../types/auth-types';
import { map, tap } from 'rxjs';

const AUTH_API = `${environment.BASE_API}/v1/auth`;

@Service()
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  private readonly _step = signal<AuthStep | null>(null);
  private readonly _isForgotPassword = signal(false);
  private readonly _accessToken = signal<string | null>(null);

  public readonly step = this._step.asReadonly();
  public readonly isForgotPassword = this._isForgotPassword.asReadonly();
  public readonly accessToken = this._accessToken.asReadonly();

  private setupAuth({ accessToken }: AuthResponse) {
    this._accessToken.set(accessToken);
  }

  public indentify(data: IdentifyData) {
    const url = `${AUTH_API}/identify`;
    return this.httpClient.post<IdentifyResponse>(url, data).pipe(
      map(({ nextStep }) => {
        this._step.set(nextStep);
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
        this._isForgotPassword.set(true);
        this._step.set('CHECK_MAIL');
      }),
    );
  }
}
