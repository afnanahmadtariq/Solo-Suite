import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { ClientService } from './client.service';
import { ProjectService } from './project.service';
import { InvoiceService } from './invoice.service';
import { LeadService } from './lead.service';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private api = inject(ApiService);
  private clientService = inject(ClientService);
  private projectService = inject(ProjectService);
  private invoiceService = inject(InvoiceService);
  private leadService = inject(LeadService);
  
  currentUser = signal<User | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkAuth();
    }
  }

  private checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      this.api.get<User>('/auth/me').subscribe({
        next: (user) => {
          this.currentUser.set(user);
          this.loadAllData();
        },
        error: () => {
          localStorage.removeItem('token');
          this.currentUser.set(null);
        },
      });
    }
  }

  private loadAllData() {
    this.clientService.loadClients();
    this.projectService.loadProjects();
    this.invoiceService.loadInvoices();
    this.leadService.loadLeads();
  }

  private clearAllData() {
    this.clientService.clearData();
    this.projectService.clearData();
    this.invoiceService.clearData();
    this.leadService.clearData();
  }

  login(email: string, password: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    
    this.loading.set(true);
    this.error.set(null);

    this.api.post<AuthResponse>('/auth/login', { email, password }).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.currentUser.set(response.user);
        this.loading.set(false);
        this.loadAllData();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Login failed');
        this.loading.set(false);
      },
    });
  }

  register(name: string, email: string, password: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    
    this.loading.set(true);
    this.error.set(null);

    this.api.post<AuthResponse>('/auth/register', { name, email, password }).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.currentUser.set(response.user);
        this.loading.set(false);
        this.loadAllData();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Registration failed');
        this.loading.set(false);
      },
    });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.currentUser.set(null);
    this.clearAllData();
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    if (!isPlatformBrowser(this.platformId)) return false;
    return this.currentUser() !== null || localStorage.getItem('token') !== null;
  }
}
