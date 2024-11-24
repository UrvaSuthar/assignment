import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable, of } from 'rxjs';
import { LogInDTO, SignUpDTO } from '../../model/logInDTO';
import { environment } from '../../../../environments/environment.development';
import { User } from '../../../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient) {}

  private apiUrl = environment.apiBaseUrl;

  login(data: LogInDTO): Observable<User | undefined> {
    const { username, password } = data;

    return this._http
      .get<User[]>(this.apiUrl + environment.endpoints.users)
      .pipe(
        map((res: User[]) => {
          const user = res.find(
            (user: User) =>
              user.email === username && user.password === password
          );
          return user ? user : undefined;
        })
      );
  }

  signup(data: SignUpDTO): Observable<SignUpDTO> {
    this._http
      .get(`${this.apiUrl}${environment.endpoints.roles}/2`)
      .subscribe((res) => {
        const registerData = { ...data, role: res, isActive: true };
        this._http
          .post(this.apiUrl + environment.endpoints.users, registerData)
          .subscribe();
      });
    return of(data);
  }
}
