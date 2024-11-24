import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RoleService } from '../../../../shared/services/role.service';
import { PermissionService } from '../../../../shared/services/permission.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CommonModule } from '@angular/common';
import { Permission } from '../../../../shared/models/permission';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzToolTipModule,
    NzIconModule,
    NzModalModule,
    NzPaginationModule,
    CommonModule,
    NzTagModule,
  ],
  templateUrl: './roleManagement.component.html',
  styleUrls: ['./roleManagement.component.css', '../../../../../styles.css'],
})
export class RoleManagementComponent implements OnInit {
  roles: any[] = [];
  allPermissions: any[] = [];
  isLoading = true;
  isRoleModalVisible = false;
  editMode = false;
  roleForm!: FormGroup;

  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
    this.initForm();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe((roles) => {
      this.roles = roles;
      this.isLoading = false;
    });
  }

  loadPermissions(): void {
    this.permissionService.getPermissions().subscribe((permissions) => {
      this.allPermissions = permissions;
    });
  }

  initForm(): void {
    this.roleForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      permissions: [[], [Validators.required]],
    });
  }

  openRoleForm(role: any = null): void {
    this.editMode = !!role;
    if (role) {
      this.roleForm.patchValue({
      id: role.id,
      name: role.name,
      permissions: role.permissions.map((id: number) => {
        return this.allPermissions.find((perm: Permission) => perm.id == id)
        .id;
      }),
      });
      if (role.isProtected) {
      this.roleForm.get('name')?.disable();
      }

    } else {
      this.roleForm.reset();
    }
    this.isRoleModalVisible = true;
  }

  closeModal(): void {
    this.roleForm.get('name')?.enable();
    this.roleForm.reset();
    this.isRoleModalVisible = false;
  }

  getPermissionName(permissionId: number): string {
    return this.allPermissions.find(
      (perm: Permission) => perm.id == permissionId
    ).name;
  }

  submitRoleForm(): void {
    if (this.roleForm.invalid) return;

    const roleData = {
      ...this.roleForm.value,
      permissions: this.roleForm.value.permissions.map((id: number) =>
        this.allPermissions.find((perm) => perm.id === id)
      ),
    };

    if (this.editMode) {
      const updateData = {
        ...roleData,
        permissions: roleData.permissions.map((perm: Permission) => perm.id),
      };
      this.roleService.updateRole(updateData).subscribe((res) => {
        this.roleService.updateUsersWithRole(res.id, res).subscribe((res) => {
          this.loadRoles();
          this.closeModal();
        });
      });
    } else {
      const createData = {
        name: roleData.name,
        permissions: roleData.permissions.map((perm: Permission) => perm.id),
        isProtected: false,
      };
      this.roleService.createRole(createData).subscribe(() => {
        this.loadRoles();
        this.closeModal();
      });
    }
  }

  deleteRole(roleId: number): void {
    this.roleService.deleteRole(roleId).subscribe(() => {
      this.loadRoles();
    });
  }
}
