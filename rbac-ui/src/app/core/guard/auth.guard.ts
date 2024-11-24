import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { TOKEN } from '../helper/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const authToken = this.getAuthToken();
    if (!authToken || authToken.exp <= Date.now() || !authToken.isActive) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }

  private getAuthToken(): any {
    try {
      const token = localStorage.getItem(TOKEN);
      return token ? JSON.parse(token) : null;
    } catch (e) {
      console.warn('Error accessing localStorage', e);
      return null;
    }
  }
}
