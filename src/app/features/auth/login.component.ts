import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 class="text-center text-5xl font-extrabold text-orange-500 mb-2">Solo Suite</h1>
        <h2 class="text-center text-2xl font-bold text-white">
          {{ isRegisterMode() ? 'Create Account' : 'Welcome Back' }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-400">
          {{ isRegisterMode() ? 'Start managing your freelance business' : 'Sign in to manage your freelance business' }}
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-gray-800 py-8 px-4 shadow-2xl border border-gray-700 sm:rounded-xl sm:px-10">
          @if (authService.error()) {
            <div class="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {{ authService.error() }}
            </div>
          }

          <form (submit)="submit(); $event.preventDefault()" class="space-y-6">
            @if (isRegisterMode()) {
              <div>
                <label for="name" class="block text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <div class="mt-1">
                  <input [(ngModel)]="name" name="name" id="name" type="text" autocomplete="name" required class="appearance-none block w-full px-4 py-3 border border-gray-700 bg-gray-900 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                </div>
              </div>
            }

            <div>
              <label for="email" class="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div class="mt-1">
                <input [(ngModel)]="email" name="email" id="email" type="email" autocomplete="email" required class="appearance-none block w-full px-4 py-3 border border-gray-700 bg-gray-900 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div class="mt-1">
                <input [(ngModel)]="password" name="password" id="password" type="password" autocomplete="current-password" required class="appearance-none block w-full px-4 py-3 border border-gray-700 bg-gray-900 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              </div>
            </div>

            @if (!isRegisterMode()) {
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-700 rounded bg-gray-900">
                  <label for="remember-me" class="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>

                <div class="text-sm">
                  <a href="#" class="font-medium text-orange-500 hover:text-orange-400">
                    Forgot password?
                  </a>
                </div>
              </div>
            }

            <div>
              <button 
                type="submit" 
                [disabled]="authService.loading()"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-black bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                @if (authService.loading()) {
                  <svg class="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                } @else {
                  {{ isRegisterMode() ? 'Create Account' : 'Sign in' }}
                }
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-700"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-gray-800 text-gray-400">
                  {{ isRegisterMode() ? 'Already have an account?' : 'New to Solo Suite?' }}
                </span>
              </div>
            </div>

            <div class="mt-6">
              <button 
                type="button" 
                (click)="toggleMode()"
                class="w-full flex justify-center py-3 px-4 border border-gray-700 rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                {{ isRegisterMode() ? 'Sign in instead' : 'Create an account' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  authService = inject(AuthService);
  
  email = '';
  password = '';
  name = '';
  isRegisterMode = signal(false);

  toggleMode() {
    this.isRegisterMode.update(v => !v);
    this.authService.error.set(null);
  }

  submit() {
    if (this.isRegisterMode()) {
      this.authService.register(this.name, this.email, this.password);
    } else {
      this.authService.login(this.email, this.password);
    }
  }
}
