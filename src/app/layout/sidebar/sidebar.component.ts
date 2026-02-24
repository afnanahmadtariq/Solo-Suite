import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div
      class="h-full bg-sidebar border-r border-theme flex flex-col transition-all duration-300"
      [style.width]="collapsed() ? '4rem' : '14rem'"
    >
      <!-- Header -->
      <div class="p-3 border-b border-theme flex items-center" [class.justify-between]="!collapsed()" [class.justify-center]="collapsed()">
        @if (!collapsed()) {
          <div class="min-w-0">
            <h1 class="text-lg font-bold text-orange-500 truncate">Solo Suite</h1>
            <p class="text-[10px] text-subtle truncate">Freelance CRM</p>
          </div>
        }
        <button
          (click)="toggle.emit()"
          class="p-1.5 text-muted hover:text-heading hover:bg-raised rounded-lg transition-colors flex-shrink-0"
          [attr.aria-label]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <svg class="w-4 h-4 transition-transform" [class.rotate-180]="collapsed()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        <a routerLink="/dashboard" routerLinkActive="bg-orange-500/10 text-orange-500 border-orange-500"
           class="flex items-center px-3 py-2 text-muted rounded-lg hover:bg-raised hover:text-heading transition-colors border border-transparent"
           [class.justify-center]="collapsed()" [attr.title]="collapsed() ? 'Dashboard' : null">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          @if (!collapsed()) { <span class="ml-3 text-sm font-medium truncate">Dashboard</span> }
        </a>
        <a routerLink="/leads" routerLinkActive="bg-orange-500/10 text-orange-500 border-orange-500"
           class="flex items-center px-3 py-2 text-muted rounded-lg hover:bg-raised hover:text-heading transition-colors border border-transparent"
           [class.justify-center]="collapsed()" [attr.title]="collapsed() ? 'Leads' : null">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          @if (!collapsed()) { <span class="ml-3 text-sm font-medium truncate">Leads</span> }
        </a>
        <a routerLink="/clients" routerLinkActive="bg-orange-500/10 text-orange-500 border-orange-500"
           class="flex items-center px-3 py-2 text-muted rounded-lg hover:bg-raised hover:text-heading transition-colors border border-transparent"
           [class.justify-center]="collapsed()" [attr.title]="collapsed() ? 'Clients' : null">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          @if (!collapsed()) { <span class="ml-3 text-sm font-medium truncate">Clients</span> }
        </a>
        <a routerLink="/projects" routerLinkActive="bg-orange-500/10 text-orange-500 border-orange-500"
           class="flex items-center px-3 py-2 text-muted rounded-lg hover:bg-raised hover:text-heading transition-colors border border-transparent"
           [class.justify-center]="collapsed()" [attr.title]="collapsed() ? 'Projects' : null">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          @if (!collapsed()) { <span class="ml-3 text-sm font-medium truncate">Projects</span> }
        </a>
        <a routerLink="/invoices" routerLinkActive="bg-orange-500/10 text-orange-500 border-orange-500"
           class="flex items-center px-3 py-2 text-muted rounded-lg hover:bg-raised hover:text-heading transition-colors border border-transparent"
           [class.justify-center]="collapsed()" [attr.title]="collapsed() ? 'Invoices' : null">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          @if (!collapsed()) { <span class="ml-3 text-sm font-medium truncate">Invoices</span> }
        </a>
      </nav>

      <!-- Footer -->
      <div class="p-2 border-t border-theme space-y-1">
        <!-- Theme Toggle -->
        <button
          (click)="themeService.toggle()"
          class="w-full flex items-center px-3 py-2 text-muted hover:text-heading hover:bg-raised rounded-lg transition-colors"
          [class.justify-center]="collapsed()"
          [attr.title]="collapsed() ? 'Toggle theme' : null"
          aria-label="Toggle theme"
        >
          @if (themeService.theme() === 'dark') {
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          } @else {
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          }
          @if (!collapsed()) {
            <span class="ml-3 text-sm font-medium truncate">{{ themeService.theme() === 'dark' ? 'Light Mode' : 'Dark Mode' }}</span>
          }
        </button>

        <!-- Profile -->
        <a routerLink="/profile" routerLinkActive="bg-raised"
           class="flex items-center p-2 rounded-lg hover:bg-raised transition-colors cursor-pointer"
           [class.justify-center]="collapsed()" [attr.title]="collapsed() ? 'Profile' : null">
          <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-black font-bold text-xs flex-shrink-0">{{ userInitials }}</div>
          @if (!collapsed()) {
            <div class="flex-1 min-w-0 ml-3">
              <p class="text-sm font-medium text-heading truncate">{{ user()?.name }}</p>
              <p class="text-[10px] text-subtle truncate">View Profile</p>
            </div>
          }
        </a>

        <!-- Logout -->
        <button
          (click)="logout()"
          class="w-full flex items-center px-3 py-2 text-muted hover:text-heading hover:bg-raised rounded-lg transition-colors"
          [class.justify-center]="collapsed()" [attr.title]="collapsed() ? 'Logout' : null"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          @if (!collapsed()) { <span class="ml-3 text-sm font-medium truncate">Logout</span> }
        </button>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private authService = inject(AuthService);
  themeService = inject(ThemeService);

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
