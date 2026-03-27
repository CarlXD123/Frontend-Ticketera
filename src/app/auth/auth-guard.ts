import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    // 🔹 En SSR devolvemos false (no hay localStorage)
    if (typeof window === 'undefined') return false;

    // 🔹 Si no está logueado, redirige
    if (!this.auth.isLogged()) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}