import { Injectable } from '@angular/core';
import { DataService, Role } from '../../data/data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private dataService: DataService) {}

  getRoles(): Observable<Role[]> {
    return this.dataService.getRoles();
  }

  hasPermission(userRole: Role, requiredPermission: string): boolean {
    return userRole.permissions.includes(requiredPermission);
  }

  hasRole(userRole: Role, requiredRole: string): boolean {
    return userRole.name === requiredRole;
  }
}
