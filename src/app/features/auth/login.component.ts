import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <!-- Background gradient orbs -->
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>

      <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h1 class="text-center text-4xl font-extrabold text-white tracking-tight">
          <span class="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">Solo Suite</span>
        </h1>
        <p class="text-center text-xs text-gray-600 mt-1 uppercase tracking-[0.2em] font-semibold">Freelance CRM</p>
        <h2 class="text-center text-xl font-bold text-white mt-8">
          {{ isRegisterMode() ? 'Create Account' : 'Welcome Back' }}
        </h2>
        <p class="mt-1 text-center text-sm text-gray-500">
          {{ isRegisterMode() ? 'Start managing your freelance business' : 'Sign in to your workspace' }}
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div class="bg-gray-900 py-8 px-6 shadow-2xl border border-gray-800 sm:rounded-xl sm:px-10">
          @if (authService.error()) {
            <div class="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              {{ authService.error() }}
            </div>
          }

          @if (isRegisterMode()) {
            <form [formGroup]="registerForm" (ngSubmit)="submitRegister()" class="space-y-5">
              <div>
                <label for="reg-name" class="form-label">Full Name *</label>
                <input formControlName="name" id="reg-name" type="text" autocomplete="name" class="form-input" placeholder="John Smith">
                @if (registerForm.get('name')?.touched && registerForm.get('name')?.errors?.['required']) {
                  <p class="field-error">Name is required</p>
                }
                @if (registerForm.get('name')?.touched && registerForm.get('name')?.errors?.['minlength']) {
                  <p class="field-error">Name must be at least 2 characters</p>
                }
              </div>
              <div>
                <label for="reg-email" class="form-label">Email Address *</label>
                <input formControlName="email" id="reg-email" type="email" autocomplete="email" class="form-input" placeholder="john@example.com">
                @if (registerForm.get('email')?.touched && registerForm.get('email')?.errors?.['required']) {
                  <p class="field-error">Email is required</p>
                }
                @if (registerForm.get('email')?.touched && registerForm.get('email')?.errors?.['email']) {
                  <p class="field-error">Must be a valid email address</p>
                }
              </div>
              <div>
                <label for="reg-password" class="form-label">Password *</label>
                <input formControlName="password" id="reg-password" type="password" autocomplete="new-password" class="form-input" placeholder="••••••••">
                @if (registerForm.get('password')?.touched && registerForm.get('password')?.errors?.['required']) {
                  <p class="field-error">Password is required</p>
                }
                @if (registerForm.get('password')?.touched && registerForm.get('password')?.errors?.['minlength']) {
                  <p class="field-error">Password must be at least 6 characters</p>
                }
              </div>
              <button type="submit" [disabled]="registerForm.invalid || authService.loading()" class="btn-primary w-full py-3">
                @if (authService.loading()) {
                  <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                } @else {
                  Create Account
                }
              </button>
            </form>
          } @else {
            <form [formGroup]="loginForm" (ngSubmit)="submitLogin()" class="space-y-5">
              <div>
                <label for="login-email" class="form-label">Email Address *</label>
                <input formControlName="email" id="login-email" type="email" autocomplete="email" class="form-input" placeholder="john@example.com">
                @if (loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['required']) {
                  <p class="field-error">Email is required</p>
                }
                @if (loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['email']) {
                  <p class="field-error">Must be a valid email address</p>
                }
              </div>
              <div>
                <label for="login-password" class="form-label">Password *</label>
                <input formControlName="password" id="login-password" type="password" autocomplete="current-password" class="form-input" placeholder="••••••••">
                @if (loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['required']) {
                  <p class="field-error">Password is required</p>
                }
              </div>
              <button type="submit" [disabled]="loginForm.invalid || authService.loading()" class="btn-primary w-full py-3">
                @if (authService.loading()) {
                  <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                } @else {
                  Sign In
                }
              </button>
            </form>
          }

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-800"></div></div>
              <div class="relative flex justify-center text-xs">
                <span class="px-3 bg-gray-900 text-gray-600">
                  {{ isRegisterMode() ? 'Already have an account?' : 'New to Solo Suite?' }}
                </span>
              </div>
            </div>
            <button type="button" (click)="toggleMode()" class="btn-secondary w-full mt-4">
              {{ isRegisterMode() ? 'Sign in instead' : 'Create an account' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  authService = inject(AuthService);

  isRegisterMode = signal(false);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  registerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  toggleMode() {
    this.isRegisterMode.update(v => !v);
    this.authService.error.set(null);
    this.loginForm.reset();
    this.registerForm.reset();
  }

  submitLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.loginForm.getRawValue();
    this.authService.login(email, password);
  }

  submitRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const { name, email, password } = this.registerForm.getRawValue();
    this.authService.register(name, email, password);
  }
}
