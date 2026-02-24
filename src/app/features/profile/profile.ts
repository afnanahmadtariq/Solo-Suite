import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { PopupService } from '../../core/services/popup.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto p-4 md:p-8">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-white tracking-tight">Profile Settings</h1>
        <p class="text-gray-500 mt-1 text-sm">Manage your account details and preferences.</p>
      </div>

      <div class="card overflow-hidden mb-6">
        <div class="p-6 border-b border-gray-800">
          <h2 class="text-lg font-bold text-white">Personal Information</h2>
          <p class="text-xs text-gray-500 mt-1">Update your name and email address.</p>
        </div>

        <div class="p-6">
          <form [formGroup]="profileForm" (ngSubmit)="onSave()">
            <div class="space-y-5">
              <div>
                <label for="profile-name" class="form-label">Full Name *</label>
                <input
                  type="text"
                  id="profile-name"
                  formControlName="name"
                  class="form-input"
                  placeholder="Enter your name"
                />
                @if (profileForm.get('name')?.touched && profileForm.get('name')?.errors?.['required']) {
                  <p class="field-error">Name is required</p>
                }
                @if (profileForm.get('name')?.touched && profileForm.get('name')?.errors?.['minlength']) {
                  <p class="field-error">Name must be at least 2 characters</p>
                }
              </div>

              <div>
                <label for="profile-email" class="form-label">Email Address *</label>
                <input
                  type="email"
                  id="profile-email"
                  formControlName="email"
                  class="form-input"
                  placeholder="name@example.com"
                />
                @if (profileForm.get('email')?.touched && profileForm.get('email')?.errors?.['required']) {
                  <p class="field-error">Email is required</p>
                }
                @if (profileForm.get('email')?.touched && profileForm.get('email')?.errors?.['email']) {
                  <p class="field-error">Must be a valid email address</p>
                }
              </div>

              @if (authService.error()) {
                <div class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                  <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {{ authService.error() }}
                </div>
              }

              @if (updateSuccess()) {
                <div class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm flex items-center gap-2">
                  <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Profile updated successfully!
                </div>
              }

              <div class="flex justify-end pt-2">
                <button
                  type="submit"
                  [disabled]="profileForm.invalid || authService.loading()"
                  class="btn-primary min-w-[140px]"
                >
                  @if (authService.loading()) {
                    <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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

      <div class="rounded-xl border border-red-500/20 overflow-hidden bg-gray-950">
        <div class="p-6 border-b border-red-500/20">
          <h2 class="text-lg font-bold text-red-400 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Danger Zone
          </h2>
          <p class="text-xs text-gray-600 mt-1 pl-7">Irreversible and destructive actions.</p>
        </div>
        <div class="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 class="text-white font-semibold text-sm">Delete Account</h3>
            <p class="text-xs text-gray-600 mt-1 max-w-md leading-relaxed">Once you delete your account, there is no going back. All of your data, clients, projects, and invoices will be permanently removed.</p>
          </div>
          <button
            (click)="onDeleteAccount()"
            class="px-5 py-2.5 bg-transparent text-red-400 font-semibold text-sm rounded-lg border border-red-500/30 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex-shrink-0"
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
  private fb = inject(FormBuilder);
  private popupService = inject(PopupService);

  profileForm!: FormGroup;
  updateSuccess = signal(false);

  constructor() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
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

      setTimeout(() => {
        if (!this.authService.error()) {
          this.updateSuccess.set(true);
          setTimeout(() => this.updateSuccess.set(false), 3000);
        }
      }, 800);
    }
  }

  async onDeleteAccount() {
    const confirmed = await this.popupService.confirm({
      title: 'Delete Account',
      message: 'Are you absolutely sure? All of your data, clients, projects, and invoices will be permanently deleted. This cannot be undone.',
      confirmText: 'Delete My Account',
      cancelText: 'Cancel',
      type: 'danger'
    });
    if (confirmed) {
      this.authService.deleteProfile();
    }
  }
}
