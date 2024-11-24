import { Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { SignupComponent } from './core/components/signup/signup.component';
import { AuthGuard } from './core/guard/auth.guard';
import { DashboardComponent } from './features/admin/components/dashboard/dashboard.component';
import { UserManagementComponent } from './features/admin/components/userManagement/userManagement.component';
import { RoleManagementComponent } from './features/admin/components/roleManagment/roleManagement.component';
import { PermissionManagementComponent } from './features/admin/components/permissionManagement/permissionManagement.component';
import { UserComponent } from './features/user/components/user/user.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: SignupComponent,
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    children: [
      {

        path: 'dashboard',
        component: DashboardComponent,
        children: [
          {
            path: '',
            redirectTo: 'user',
            pathMatch: 'full',
          },
          {
            path: 'user',
            component: UserManagementComponent,
          },
          {
            path: 'role',
            component: RoleManagementComponent,
          },
          {
            path: 'permission',
            component: PermissionManagementComponent,
          }
        ],
      },
    ],
  },
  {
    path: 'users',
    component: UserComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'auth/login' }, // Fallback route
];
