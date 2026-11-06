import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@envs/environment';
import { User } from '../user-types';

const USERS_API = `${environment.BASE_API}/v1/users`;

@Service()
export class UserApiService {
  private readonly httpClient = inject(HttpClient);

  public getAuthenticatedUser() {
    const url = `${USERS_API}/me`;
    return this.httpClient.get<User>(url);
  }
}
