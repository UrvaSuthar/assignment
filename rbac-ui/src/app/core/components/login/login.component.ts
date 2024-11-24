import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  DeactiveAccount,
  LoginErr,
  LoginSuccess,
  TOKEN,
} from '../../helper/constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NzIconModule,
    NzFormModule,
    NzInputModule,
    NzCardModule,
    NzButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../../../styles.css'],
})
export class LoginComponent implements OnInit {
  validateForm = this.fb.group({
    username: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required]),
  });
  passwordVisible = false;
  constructor(
    private _authService: AuthService,
    private _message: NzMessageService,
    private _router: Router,
    private fb: NonNullableFormBuilder
  ) {
    if (localStorage.getItem(TOKEN)) {
      localStorage.removeItem(TOKEN);
    }
  }

  ngOnInit() {}

  submitForm() {
    if (this.validateForm.valid) {
      const username = this.validateForm.value.username as string;
      const password = this.validateForm.value.password as string;
      this._authService.login({ username, password }).subscribe((user) => {
        if (user && user.isActive) {
          localStorage.setItem(
            TOKEN,
            JSON.stringify({ ...user, exp: Date.now() + 1000 * 60 * 60 * 24 })
          );
          this._message.success(LoginSuccess);
          console.log(user);

          if (user.role.id == 1) this._router.navigate(['/admin/dashboard']);
          else this._router.navigate(['/users']);
        } else if (user && !user.isActive) {
          this._message.error(DeactiveAccount);
        } else {
          this._message.error(LoginErr);
          this.validateForm.reset();
        }
      });
    } else {
      Object.keys(this.validateForm.controls).forEach((field) => {
        const control = this.validateForm.get(field);
        if (control) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
