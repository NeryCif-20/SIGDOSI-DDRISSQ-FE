import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@envs/environment';
import { Permission, PermissionData, PermissionFilters } from '../types/permission-types';
import { toHttpQueryParams } from '../../../shared/utils/http-params-util';
import { Page } from '../../../shared/types/shared-types';

const PERMISSIONS_API = `${environment.BASE_API}/v1/permissions`;

@Service()
export class PermissionApiService {
  private readonly httpClient = inject(HttpClient);

  public get(id: string) {
    const url = `${PERMISSIONS_API}/${id}`;
    return this.httpClient.get(url);
  }

  public create(data: PermissionData) {
    return this.httpClient.post<Permission>(PERMISSIONS_API, data);
  }

  public update(id: string, data: Partial<PermissionData>) {
    const url = `${PERMISSIONS_API}/${id}`;
    return this.httpClient.patch<Permission>(url, data);
  }

  public getAll(filters: PermissionFilters) {
    const params = toHttpQueryParams(filters);
    return this.httpClient.get<Page<Permission>>(PERMISSIONS_API, { params });
  }
}
