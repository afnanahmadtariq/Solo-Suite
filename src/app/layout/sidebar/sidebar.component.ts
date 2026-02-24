import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="h-full bg-black border-r border-gray-800 flex flex-col transition-all duration-300" [class]="collapsed() ? 'w-16' : 'w-56'">
      <!-- Header -->
      <div class="p-4 border-b border-gray-800 flex items-center justify-between">
        @if (!collapsed()) {
          <div>
            <h1 class="text-xl font-bold text-orange-500">Solo Suite</h1>
            <p class="text-xs text-gray-500">Freelance CRM</p>
          </div>
        }
        <button 
          (click)="toggle.emit()" 
          class="p-2 text-gray-400 hover:text-white hover:bg-gray-900 rounded-lg transition-colors"
          [attr.aria-label]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <svg class="w-5 h-5 transition-transform" [class.rotate-180]="collapsed()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-2 space-y-1">
        <a routerLink="/dashboard" routerLinkActive="bg-orange-500/10 text-orange-500 border-orange-500" 
           class="flex items-center px-3 py-2.5 text-gray-400 rounded-lg hover:bg-gray-900 hover:text-white transition-colors border border-transparent"
           [attr.title]="collapsed() ? 'Dashboard' : null">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          @if (!collapsed()) {
            <span class="ml-3 font-medium">Dashboard</span>
          }
        </a>
        <a routerLink="/clients" routerLinkActive="bg-orange-500/10 text-orange-500 border-orange-500" 
           class="flex items-center px-3 py-2.5 text-gray-400 rounded-lg hover:bg-gray-900 hover:text-white transition-colors border border-transparent"
           [attr.title]="collapsed() ? 'Clients' : null">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          @if (!collapsed()) {
            <span class="ml-3 font-medium">Clients</span>
          }
        </a>
        <a routerLink="/leads" routerLinkActive="bg-orange-500/10 text-orange-500 border-orange-500" 
           class="flex items-center px-3 py-2.5 text-gray-400 rounded-lg hover:bg-gray-900 hover:text-white transition-colors border border-transparent"
           [attr.title]="collapsed() ? 'Leads' : null">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          @if (!collapsed()) {
            <span class="ml-3 font-medium">Leads</span>
          }
        </a>
        <a routerLink="/projects" routerLinkActive="bg-orange-500/10 text-orange-500 border-orange-500" 
           class="flex items-center px-3 py-2.5 text-gray-400 rounded-lg hover:bg-gray-900 hover:text-white transition-colors border border-transparent"
           [attr.title]="collapsed() ? 'Projects' : null">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
          @if (!collapsed()) {
            <span class="ml-3 font-medium">Projects</span>
          }
        </a>
        <a routerLink="/invoices" routerLinkActive="bg-orange-500/10 text-orange-500 border-orange-500" 
           class="flex items-center px-3 py-2.5 text-gray-400 rounded-lg hover:bg-gray-900 hover:text-white transition-colors border border-transparent"
           [attr.title]="collapsed() ? 'Invoices' : null">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          @if (!collapsed()) {
            <span class="ml-3 font-medium">Invoices</span>
          }
        </a>
      </nav>

      <!-- User Section -->
      <div class="p-2 border-t border-gray-800">
        @if (!collapsed()) {
          <a routerLink="/profile" routerLinkActive="bg-gray-900" class="flex items-center gap-3 p-2 mb-2 rounded-lg hover:bg-gray-900 transition-colors cursor-pointer block">
            <div class="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
              {{ userInitials }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate group-hover:text-orange-500 transition-colors">{{ user()?.name }}</p>
              <p class="text-xs text-gray-500 truncate">View Profile</p>
            </div>
          </a>
          <button (click)="logout()" class="w-full px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-900 rounded-lg transition-colors">
            Logout
          </button>
        } @else {
          <a routerLink="/profile" routerLinkActive="bg-gray-900" class="w-full p-2 mb-2 hover:bg-gray-900 rounded-lg transition-colors flex items-center justify-center cursor-pointer block" title="Profile">
            <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
              {{ userInitials }}
            </div>
          </a>
          <button 
            (click)="logout()" 
            class="w-full p-2 text-gray-400 hover:text-white hover:bg-gray-900 rounded-lg transition-colors flex items-center justify-center"
            title="Logout"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </button>
        }
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private authService = inject(AuthService);

  collapsed = input(false);
  toggle = output();

  readonly user = this.authService.currentUser;

  get userInitials(): string {
    const name = this.user()?.name || '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  logout() {
    this.authService.logout();
  }
}
