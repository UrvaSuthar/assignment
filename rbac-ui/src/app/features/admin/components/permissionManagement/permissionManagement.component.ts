import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PermissionService } from '../../../../shared/services/permission.service';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CommonModule } from '@angular/common';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Permission } from '../../../../shared/models/permission';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { RoleService } from '../../../../shared/services/role.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-permission-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzSelectModule,
    NzModalModule,
    NzPaginationModule,
    NzToolTipModule,
    CommonModule,
    NzTagModule,
  ],
  templateUrl: './permissionManagement.component.html',
  styleUrls: [
    './permissionManagement.component.css',
    '../../../../../styles.css',
  ],
})
export class PermissionManagementComponent implements OnInit {
  permissions: any[] = [];
  isLoading = true;
  isPermissionModalVisible = false;
  editMode = false;
  permissionForm!: FormGroup;

  constructor(
    private permissionService: PermissionService,
    private message: NzMessageService,
    private roleService: RoleService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadPermissions();
    this.initForm();
  }

  loadPermissions(): void {
    this.permissionService.getPermissions().subscribe((permissions) => {
      this.permissions = permissions;
      this.isLoading = false;
    });
  }

  initForm(): void {
    this.permissionForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
    });
  }

  openPermissionForm(permission: any = null): void {
    this.editMode = !!permission;
    if (permission) {
      this.permissionForm.patchValue(permission);
    } else {
      this.permissionForm.reset();
    }
    this.isPermissionModalVisible = true;
  }

  closeModal(): void {
    this.isPermissionModalVisible = false;
  }

  submitPermissionForm(): void {
    if (this.permissionForm.invalid) return;

    const permissionData: Permission = this.permissionForm.value;
    permissionData.isProtected = false;

    if (this.editMode) {
      this.permissionService.updatePermission(permissionData).subscribe(() => {
        this.loadPermissions();
        this.closeModal();
      });
    } else {
      const lastIndex = this.permissions[this.permissions.length - 1].id;
      const newId = lastIndex + 1;
      permissionData.id = newId;
      this.permissionService.createPermission(permissionData).subscribe(() => {
        this.loadPermissions();
        this.closeModal();
      });
    }
  }

  deletePermission(permissionId: number): void {
    let permission: any[] = []
    this.roleService.getRoles().subscribe((roles) => {
      roles.forEach((role) => {
        permission.push(role.permissions.filter((p) => p == permissionId));
      });
      permission = permission.flat();
      if (permission.length == 0) {  
        this.permissionService.deletePermission(permissionId).subscribe(() => {
          this.loadPermissions();
        });
      }
    else{
      this.message.error('Permission is in use');
    }
      })
  }
}
