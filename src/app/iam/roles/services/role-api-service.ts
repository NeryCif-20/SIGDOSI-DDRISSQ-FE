import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@envs/environment';
import { Role, RoleData, RoleQueryParams } from '../types/role-types';
import { toHttpQueryParams } from '../../../shared/utils/http-params-util';
import { Page } from '../../../shared/types/pagination-types';
import { toRole } from '../utils/role-util';

const ROLES_API = `${environment.BASE_API}/v1/roles`;

@Service()
export class RoleApiService {
  private readonly httpClient = inject(HttpClient);

  public get(id: string) {
    const url = `${ROLES_API}/${id}`;
    return this.httpClient.get<Role>(url);
  }

  public create(data: RoleData) {
    return this.httpClient.post<Role>(ROLES_API, toRole(data));
  }

  public update(id: string, data: Partial<RoleData>) {
    const url = `${ROLES_API}/${id}`;
    return this.httpClient.patch<Role>(url, toRole(data));
  }

  public delete(id: string) {
    const url = `${ROLES_API}/${id}`;
    return this.httpClient.delete<void>(url);
  }

  public getAll(filters?: RoleQueryParams) {
    const params = toHttpQueryParams(filters ?? {});
    return this.httpClient.get<Page<Role>>(ROLES_API, { params });
  }
}
