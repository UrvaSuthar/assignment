import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Role, RoleCreate } from '../models/role';
import { environment } from '../../../environments/environment.development';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from './user.service'; // Ensure you have this import
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private baseUrl = environment.apiBaseUrl + environment.endpoints.roles;

  constructor(private http: HttpClient, private userService: UserService) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.baseUrl);
  }

  getRoleById(roleId: number): Observable<Role> {
    return this.http.get<Role>(`${this.baseUrl}/${roleId}`);
  }

  createRole(role: RoleCreate): Observable<Role> {
    return this.http.post<Role>(this.baseUrl, role);
  }

  updateRole(role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.baseUrl}/${role.id}`, role);
  }

  updateUsersWithRole(roleId: number, updatedRole: Role): Observable<User[]> {
    return this.userService.getUsers().pipe(
      switchMap((users) => {
        const usersToUpdate = users.filter((user) => user.role.id === roleId);
        if (usersToUpdate.length === 0) {
          return of([] as User[]);
        }
        const updateObservables = usersToUpdate.map((user) => {
          user.role = updatedRole;
          return this.userService.updateUser(user);
        });
        return forkJoin(updateObservables);
      })
    );
  }

  deleteRole(roleId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${roleId}`);
  }
}
