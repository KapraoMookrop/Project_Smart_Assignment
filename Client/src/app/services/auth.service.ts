import { Injectable, signal } from '@angular/core';
import { User, UserRole } from '../models/app-models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user_data';

  currentUser = signal<User | null>(this.getStoredUser());

  constructor(private router: Router) {}

  setSession(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  updateUserData(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  private getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const userJson = localStorage.getItem(this.USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  redirectBasedOnRole(role?: UserRole): void {
    const userRole = role || this.currentUser()?.role;
    switch (userRole) {
      case UserRole.CompanyAdmin:
        this.router.navigate(['/categories']);
        break;
      case UserRole.AppAdmin:
        this.router.navigate(['/companies']);
        break;
      case UserRole.User:
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
