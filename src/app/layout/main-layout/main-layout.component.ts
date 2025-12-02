import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="flex h-screen bg-gray-950">
      <app-sidebar class="w-64 hidden md:block" />
      <main class="flex-1 overflow-y-auto p-8 bg-gray-900">
        <router-outlet />
      </main>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {}
