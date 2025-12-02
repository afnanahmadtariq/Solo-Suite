import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<{ name: string; email: string } | null>(null);

  constructor(private router: Router) {}

  login(email: string) {
    // Mock login
    this.currentUser.set({
      name: 'Afnan',
      email: email
    });
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    return this.currentUser() !== null;
  }
}
