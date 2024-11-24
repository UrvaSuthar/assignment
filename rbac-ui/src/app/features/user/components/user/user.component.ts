import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../../../shared/services/role.service';
import { PermissionService } from '../../../../shared/services/permission.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CommonModule } from '@angular/common';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Role } from '../../../../shared/models/role';
import { Permission } from '../../../../shared/models/permission';
import { User } from '../../../../shared/models/user';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { UserService } from '../../../../shared/services/user.service';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { FormsModule } from '@angular/forms';
import { CommentComponent } from "../commments/comment.component";
import { ConfettiService } from '../../service/confetti.service';
import { HireMe, mailtoLink, Recruiter, TOKEN } from '../../../../core/helper/constants';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    NzCardModule,
    NzTagModule,
    NzButtonModule,
    NzResultModule,
    NzDividerModule,
    NzLayoutModule,
    NzFlexModule,
    NzAvatarModule,
    NzIconModule,
    NzSpaceModule,
    NzCommentModule,
    NzInputModule,
    NzFormModule,
    NzTypographyModule,
    CommentComponent,
    FormsModule,
    CommonModule,
    CommentComponent
],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css', '../../../../../styles.css'],
})
export class UserComponent implements OnInit {
  hasRecruiterRole = false;
  hasHireMePermission = false;
  userName = 'Recruiter';
  roles: Role[] = [];
  permissions: Permission[] = [];
  user: User | null = null;
  submitting = false;
  inputValue = '';

  constructor(
    private _roleService: RoleService,
    private _userService: UserService,
    private _confettiService: ConfettiService,
    private _router: Router,
    private _permissionService: PermissionService
  ) {
    const token = localStorage.getItem(TOKEN);
    if (token) {
      this.user = JSON.parse(token);
    }
  }

  ngOnInit(): void {
    if(this.user) {
    this._userService.getUserById(this.user.id).subscribe((user) => {
      this.user = user;
      this.checkUserAccess();
    })
  }
  }

  logout(): void {
    localStorage.removeItem(TOKEN);
    this._router.navigate(['/login']);
  }
  handleSubmit(): void {
    this.submitting = true;
    setTimeout(() => {
      this.submitting = false;
      this.inputValue = '';
    }, 800);
    }

  checkUserAccess(): void {
    if (this.user) {
      this.userName = this.user.name;
      this.user.role.permissions.forEach((permission) => {
        this._permissionService
          .getPermissionById(permission)
          .subscribe((permission) => {    
            if (permission.name.toLowerCase().includes(HireMe)) {
              this.hasHireMePermission = true;
            }
          });
        });
        this.hasRecruiterRole = this.user.role.name.includes(Recruiter);   
    }
  }

  onHireMeClick(): void {
    this._confettiService.launchCelebration();
    setTimeout(() => {
    window.location.href = mailtoLink;
    }, 500);
  }
}
