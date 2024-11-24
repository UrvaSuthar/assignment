import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../../shared/services/user.service';
import { RoleService } from '../../../../shared/services/role.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Admin, AdminErr } from '../../../../core/helper/constants';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzSelectModule,
    NzCheckboxModule,
    NzModalModule,
    NzPaginationModule,
    NzTagModule,
    CommonModule,
  ],
  templateUrl: './userManagement.component.html',
  styleUrls: ['./userManagement.component.css', '../../../../../styles.css'],
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  roles: any[] = [];
  isLoading = true;
  isUserModalVisible = false;
  editMode = false;
  userForm!: FormGroup;
  passwordVisible = false;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    this.initForm();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      this.isLoading = false;
    });
  }

  loadRoles(): void {
    this.isLoading = true;
    this.roleService.getRoles().subscribe((roles) => {
      this.roles = roles;
    this.isLoading = false;
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleId: [null, [Validators.required]],
      isActive: [false],
    });
  }

  openUserForm(user: any = null): void {
    this.editMode = !!user;
    if (user) {
      this.userForm.patchValue({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        roleId: user.role.id,
        isActive: user.isActive,
      });
    } else {
      this.userForm.reset();
    }
    this.isUserModalVisible = true;
  }

  closeModal(): void {
    this.isUserModalVisible = false;
  }

  submitUserForm(): void {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value;

    const roleId = userData.roleId;
    this.roleService.getRoleById(roleId).subscribe((role) => {
      if (this.editMode) {
        const updateData = { ...userData, role };
        this.userService.updateUser(updateData).subscribe(() => {
          this.loadUsers();
          this.closeModal();
        });
      } else {
        const newUser = {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role,
          isActive: userData.isActive,
        };
        this.userService.createUser(newUser).subscribe(() => {
          this.loadUsers();
          this.closeModal();
        });
      }
    });
  }

  deleteUser(userId: number): void {
    const adminUsers = this.users.filter(user => user.role.name == Admin);
    if (adminUsers.length === 1 && adminUsers[0].id === userId) {
      this.message.warning(AdminErr);
      return;
    }

    this.userService.deleteUser(userId).subscribe(() => {
      this.loadUsers();
    });
  }
}
