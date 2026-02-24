import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto p-4 md:p-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Profile Settings</h1>
        <p class="text-gray-400">Manage your account details and preferences.</p>
      </div>

      <div class="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden mb-8 shadow-xl">
        <div class="p-6 border-b border-gray-800">
          <h2 class="text-xl font-semibold text-white">Personal Information</h2>
          <p class="text-sm text-gray-500 mt-1">Update your name and email address.</p>
        </div>
        
        <div class="p-6">
          <form [formGroup]="profileForm" (ngSubmit)="onSave()">
            <div class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  formControlName="name"
                  class="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-600 shadow-inner"
                  placeholder="Enter your name"
                />
                @if (profileForm.get('name')?.touched && profileForm.get('name')?.errors?.['required']) {
                  <p class="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Name is required
                  </p>
                }
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  formControlName="email"
                  class="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-600 shadow-inner"
                  placeholder="name@example.com"
                />
                @if (profileForm.get('email')?.touched) {
                  @if (profileForm.get('email')?.errors?.['required']) {
                    <p class="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Email is required
                    </p>
                  } @else if (profileForm.get('email')?.errors?.['email']) {
                    <p class="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Please enter a valid email address
                    </p>
                  }
                }
              </div>

              @if (authService.error()) {
                <div class="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm flex items-start gap-3">
                  <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <div>{{ authService.error() }}</div>
                </div>
              }
              
              @if (updateSuccess()) {
                <div class="p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-500 text-sm flex items-start gap-3">
                  <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <div>Profile updated successfully!</div>
                </div>
              }

              <div class="flex justify-end pt-4">
                <button 
                  type="submit" 
                  [disabled]="profileForm.invalid || authService.loading()"
                  class="px-6 py-3 bg-orange-500 text-black font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px] shadow-lg shadow-orange-500/20"
                >
                  @if (authService.loading()) {
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  } @else {
                    Save Changes
                  }
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="bg-black border border-red-900/30 rounded-xl overflow-hidden shadow-lg relative group">
        <div class="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        <div class="p-6 border-b border-red-900/30 relative">
          <h2 class="text-xl font-semibold text-red-500 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Danger Zone
          </h2>
          <p class="text-sm text-gray-500 mt-1 pl-7">Irreversible and destructive actions.</p>
        </div>
        <div class="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
          <div>
            <h3 class="text-white font-medium">Delete Account</h3>
            <p class="text-sm text-gray-500 mt-1 max-w-md">Once you delete your account, there is no going back. All of your data, clients, projects, and invoices will be permanently removed.</p>
          </div>
          <button 
            (click)="onDeleteAccount()"
            class="px-6 py-3 bg-transparent text-red-500 font-semibold rounded-lg border border-red-500/50 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-all flex-shrink-0"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile implements OnInit {
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  profileForm!: FormGroup;
  updateSuccess = signal(false);

  constructor() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.profileForm.patchValue({
        name: user.name,
        email: user.email
      });
    }
  }

  onSave() {
    if (this.profileForm.valid) {
      this.updateSuccess.set(false);
      const { name, email } = this.profileForm.value;
      this.authService.updateProfile(name, email);

      // Simulate showing success if no error occurs quickly
      setTimeout(() => {
        if (!this.authService.error()) {
          this.updateSuccess.set(true);
          setTimeout(() => this.updateSuccess.set(false), 3000);
        }
      }, 800);
    }
  }

  onDeleteAccount() {
    if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      this.authService.deleteProfile();
    }
  }
}
