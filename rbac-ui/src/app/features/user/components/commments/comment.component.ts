import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RoleService } from '../../../../shared/services/role.service';
import { Role } from '../../../../shared/models/role';
import { PermissionService } from '../../../../shared/services/permission.service';
import { CommentService } from '../../service/comment.service';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzResultModule } from 'ng-zorro-antd/result';
import { Comments } from '../../model/comments';
import { User } from '../../../../shared/models/user';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../../../../shared/services/user.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Read, Write } from '../../../../core/helper/constants';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    NzCommentModule,
    NzCardModule,
    NzAvatarModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    FormsModule,
    CommonModule,
    NzResultModule,
  ],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css', '../../../../../styles.css'],
})
export class CommentComponent implements OnInit {
  comments: Array<Comments> = [];
  newComment: string = '';
  roles: Role[] = [];
  hasViewPermission = false;
  hasWritePermission = false;
  @Input() author: User | null = null;

  constructor(
    private _roleService: RoleService,
    private _permissionService: PermissionService,
    private _commentService: CommentService,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.author) {
      this._userService.getUserById(this.author.id).subscribe((user) => {
        this.author = user;
        this._roleService.getRoles().subscribe((roles) => {
          this.roles = roles;
          this.hasReadPermission().subscribe((result) => {
            this.hasViewPermission = result;
          });
          this.checkWritePermission().subscribe((result) => {
            this.hasWritePermission = result;
          });
        });
      });
    }
    this.fetchComments();
  }

  fetchComments(): void {
    this._commentService.getComments().subscribe((comments) => {
      console.log(comments);

      this.comments = comments.map((comment) => ({
        ...comment,
        datetime: new Date(comment.datetime).toLocaleString(),
      }));
    });
  }

  addComment(): void {
    if (this.newComment.trim() && this.author) {
      const comment = {
        id: this.comments.length
          ? Math.max(...this.comments.map((c) => c.id)) + 1
          : 1,
        author: this.author.name,
        content: this.newComment,
        datetime: new Date().toISOString(),
      };

      this._commentService.addComment(comment).subscribe((comment) => {
	comment.datetime = new Date(comment.datetime).toLocaleString();
        this.comments.push(comment);
        this.newComment = '';
      });
    }
  }

  hasReadPermission(): Observable<boolean> {
    if (!this.author) {
      return of(false);
    }
    const permissionObservables = this.author.role.permissions.map(
      (permissionId) => this._permissionService.getPermissionById(permissionId)
    );

    return forkJoin(permissionObservables).pipe(
      map((permissions) =>
        permissions.some(
          (permission) => permission.name.toLowerCase() === Read
        )
      ),
      catchError((err) => {
        return of(false);
      })
    );
  }

  checkWritePermission(): Observable<boolean> {
    if (!this.author) {
      return of(false);
    }
    const permissionObservables = this.author.role.permissions.map(
      (permissionId) => this._permissionService.getPermissionById(permissionId)
    );

    return forkJoin(permissionObservables).pipe(
      map((permissions) =>
        permissions.some(
          (permission) => permission.name.toLowerCase() === Write
        )
      ),
      catchError((err) => {
        return of(false);
      })
    );
  }
}
