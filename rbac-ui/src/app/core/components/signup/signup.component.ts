import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Router } from '@angular/router';
import { SignupSuccess, TOKEN } from '../../helper/constants';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    NzIconModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', '../../../../styles.css'],
})
export class SignupComponent implements OnInit {
  validateForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required]),
  });
  passwordVisible = false;
  constructor(
    private _authService: AuthService,
    private _message: NzMessageService,
    private fb: NonNullableFormBuilder,
    private _router: Router
  ) {}

  ngOnInit() {}

  submitForm(){
    if(this.validateForm.valid){
      const name = this.validateForm.value.name as string;
      const email = this.validateForm.value.email as string;
      const password = this.validateForm.value.password as string;
      this._authService.signup({name ,email, password}).subscribe(() => {
        this.validateForm.reset();
        this._message.success(SignupSuccess);
        localStorage.setItem(TOKEN, JSON.stringify({email, password, exp: Date.now() + 1000 * 60 * 60 * 24}));
        this._router.navigate(['/users']);
      });
    }
    else{
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
