import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@envs/environment';
import {
  AuthResponse,
  IdentifyData,
  IdentifyResponse,
  LoginData,
  SetupPasswordData,
  ValidatePasswordTokenData,
} from '../types/auth-types';

const AUTH_API = `${environment.BASE_API}/v1/auth`;

@Service()
export class AuthApiService {
  private readonly httpClient = inject(HttpClient);

  public indentify(data: IdentifyData) {
    const url = `${AUTH_API}/identify`;
    return this.httpClient.post<IdentifyResponse>(url, data);
  }

  public login(data: LoginData) {
    const url = `${AUTH_API}/login`;
    return this.httpClient.post<AuthResponse>(url, data);
  }

  public requestForgotPasswordMail() {
    const url = `${AUTH_API}/password/forgot`;
    return this.httpClient.post<void>(url, null);
  }

  public validatePasswordToken(data: ValidatePasswordTokenData) {
    const url = `${AUTH_API}/password/token/validate`;
    return this.httpClient.post<void>(url, data);
  }

  public setupPassword(data: SetupPasswordData) {
    const url = `${AUTH_API}/password/setup`;
    return this.httpClient.post<AuthResponse>(url, data);
  }

  public refresh() {
    const url = `${AUTH_API}/refresh`;
    return this.httpClient.post<AuthResponse>(url, null);
  }

  public logout() {
    const url = `${AUTH_API}/logout`;
    return this.httpClient.post<void>(url, null);
  }
}
