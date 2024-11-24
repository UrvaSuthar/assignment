import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permission } from '../models/permission';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private baseUrl = environment.apiBaseUrl + environment.endpoints.permissions;

  constructor(private http: HttpClient) {}

  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.baseUrl);
  }

  getPermissionById(permissionId: number): Observable<Permission> {
    return this.http.get<Permission>(`${this.baseUrl}/${permissionId}`);
  }

  createPermission(permission: Permission): Observable<Permission> {
    return this.http.post<Permission>(this.baseUrl, permission);
  }

  updatePermission(permission: Permission): Observable<Permission> {
    return this.http.put<Permission>(
      `${this.baseUrl}/${permission.id}`,
      permission
    );
  }

  deletePermission(permissionId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${permissionId}`);
  }
}
