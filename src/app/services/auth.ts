import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private api: ApiService) {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }


  login(data: { email: string; password: string }): Observable<any> {
    return this.api.login(data);
  }


  saveToken(token: string) {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
    }
  }


  isLogged(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem('token');
  }


  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
  }

 
  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('token');
  }
}