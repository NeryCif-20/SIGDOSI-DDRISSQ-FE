import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@envs/environment';
import { User, UserData, UserQueryParams } from '../types/user-types';
import { toHttpQueryParams } from '../../../shared/utils/http-params-util';
import { Page } from '../../../shared/types/pagination-types';

const USERS_API = `${environment.BASE_API}/v1/users`;

@Service()
export class UserApiService {
  private readonly httpClient = inject(HttpClient);

  public get(id: string) {
    const url = `${USERS_API}/${id}`;
    return this.httpClient.get<User>(url);
  }

  public create(data: UserData) {
    return this.httpClient.post<User>(USERS_API, data);
  }

  public update(id: string, data: Partial<UserData>) {
    const url = `${USERS_API}/${id}`;
    return this.httpClient.patch<User>(url, data);
  }

  public getAll(filters: UserQueryParams) {
    const params = toHttpQueryParams(filters);
    return this.httpClient.get<Page<User>>(USERS_API, { params });
  }

  public getMe() {
    const url = `${USERS_API}/me`;
    return this.httpClient.get<User>(url);
  }
}
