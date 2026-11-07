import { HttpParams } from '@angular/common/http';

export function toHttpQueryParams<T extends object>(object: T) {
  let queryParams = new HttpParams();
  Object.entries(object as [string, unknown]).forEach(([key, value]) => {
    switch (true) {
      case value === '' || value === undefined || value === null:
        break;
      case Array.isArray(value):
        value.forEach((item) => {
          if (item !== null && item !== undefined && item !== '') {
            queryParams = queryParams.append(key, String(item));
          }
        });
        break;
      case value instanceof Date:
        queryParams = queryParams.set(key, value.toISOString());
        break;
      default:
        queryParams = queryParams.set(key, String(value));
        break;
    }
  });
  return queryParams;
}
