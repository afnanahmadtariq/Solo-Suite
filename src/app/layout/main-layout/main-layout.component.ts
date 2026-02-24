import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="flex h-screen bg-app flex-col md:flex-row relative overflow-hidden">
      <!-- Mobile Header -->
      <div class="md:hidden flex items-center justify-between p-4 border-b border-theme bg-sidebar z-30">
        <div class="flex items-center">
          <h1 class="text-lg font-bold text-orange-500">Solo Suite</h1>
        </div>
        <button (click)="mobileMenuOpen.set(true)" class="p-2 text-muted hover:text-heading active:scale-[0.98] transition-all rounded-lg hover:bg-raised" aria-label="Open navigation menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>

      <!-- Sidebar Backdrop for Mobile -->
      @if (mobileMenuOpen()) {
        <div 
          class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          (click)="mobileMenuOpen.set(false)"
        ></div>
      }

      <!-- Sidebar -->
      <app-sidebar
        class="fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex-shrink-0 h-full"
        [class.-translate-x-full]="!mobileMenuOpen()"
        [class.translate-x-0]="mobileMenuOpen()"
        [collapsed]="sidebarCollapsed()"
        (toggle)="sidebarCollapsed.set(!sidebarCollapsed())"
        (click)="closeMobileMenuOnNav($event)"
      />

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-app scrollbar-hidden">
        <router-outlet />
      </main>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  sidebarCollapsed = signal(false);
  mobileMenuOpen = signal(false);

  closeMobileMenuOnNav(event: Event) {
    // Basic check to see if an anchor was clicked to navigate, so we close the drawer automatically
    const target = event.target as HTMLElement;
    if (target.closest('a')) {
      this.mobileMenuOpen.set(false);
    }
  }
}
