import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ClientService, Client } from '../../core/services/client.service';
import { PopupService } from '../../core/services/popup.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-client-list',
  imports: [ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-extrabold text-white tracking-tight">Clients</h2>
          <p class="text-gray-500 mt-1 text-sm">Manage your client relationships</p>
        </div>
        <button (click)="openAddModal()" class="btn-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Client
        </button>
      </div>

      <div class="table-container">
        <table class="min-w-full divide-y divide-gray-800">
          <thead class="table-header">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Client</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800/60">
            @for (client of clientService.clients(); track client.id) {
              <tr class="table-row transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-orange-500/20">
                      {{ client.name.charAt(0) }}
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-semibold text-white">{{ client.name }}</div>
                      <div class="text-xs text-gray-500">{{ client.company }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-300">{{ client.email }}</div>
                  <div class="text-xs text-gray-500">{{ client.phone }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="client.status === 'Active'
                    ? 'badge bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
                    : 'badge bg-gray-500/15 text-gray-400 ring-1 ring-gray-500/30'">
                    {{ client.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex gap-1 justify-end">
                    <button (click)="openEditModal(client)" class="p-2 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-all" aria-label="Edit client">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button (click)="deleteClient(client.id)" class="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" aria-label="Delete client">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="px-6 py-16 text-center">
                  <div class="text-gray-500 text-sm">No clients yet. Click "Add Client" to get started.</div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Client Modal -->
    @if (showModal()) {
      <div class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 modal-backdrop" (click)="closeModal()">
        <div class="bg-gray-900 rounded-xl p-8 max-w-md w-full border border-gray-800 shadow-2xl modal-panel" (click)="$event.stopPropagation()">
          <h3 class="text-xl font-bold text-white mb-6">{{ editingClientId() ? 'Edit Client' : 'Add New Client' }}</h3>
          <form [formGroup]="form" (ngSubmit)="saveClient()" class="space-y-5">
            <div>
              <label for="client-name" class="form-label">Full Name *</label>
              <input formControlName="name" id="client-name" type="text" class="form-input" placeholder="John Smith">
              @if (form.get('name')?.touched && form.get('name')?.errors?.['required']) {
                <p class="field-error">Name is required</p>
              }
              @if (form.get('name')?.touched && form.get('name')?.errors?.['minlength']) {
                <p class="field-error">Name must be at least 2 characters</p>
              }
            </div>
            <div>
              <label for="client-company" class="form-label">Company *</label>
              <input formControlName="company" id="client-company" type="text" class="form-input" placeholder="Smith & Associates">
              @if (form.get('company')?.touched && form.get('company')?.errors?.['required']) {
                <p class="field-error">Company is required</p>
              }
            </div>
            <div>
              <label for="client-email" class="form-label">Email *</label>
              <input formControlName="email" id="client-email" type="email" class="form-input" placeholder="john@smith.com">
              @if (form.get('email')?.touched && form.get('email')?.errors?.['required']) {
                <p class="field-error">Email is required</p>
              }
              @if (form.get('email')?.touched && form.get('email')?.errors?.['email']) {
                <p class="field-error">Must be a valid email address</p>
              }
            </div>
            <div>
              <label for="client-phone" class="form-label">Phone *</label>
              <input formControlName="phone" id="client-phone" type="tel" class="form-input" placeholder="555-123-4567">
              @if (form.get('phone')?.touched && form.get('phone')?.errors?.['required']) {
                <p class="field-error">Phone is required</p>
              }
              @if (form.get('phone')?.touched && form.get('phone')?.errors?.['pattern']) {
                <p class="field-error">Enter a valid phone number</p>
              }
            </div>
            <div>
              <label for="client-status" class="form-label">Status</label>
              <select formControlName="status" id="client-status" class="form-select">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div class="flex gap-3 pt-2">
              <button type="button" (click)="closeModal()" class="btn-secondary flex-1">Cancel</button>
              <button type="submit" [disabled]="form.invalid" class="btn-primary flex-1">
                {{ editingClientId() ? 'Save Changes' : 'Add Client' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientListComponent {
  private readonly popupService = inject(PopupService);
  private readonly fb = inject(FormBuilder);
  clientService = inject(ClientService);

  showModal = signal(false);
  editingClientId = signal<number | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    company: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[\d\s\-\+\(\)]+$/)]],
    status: ['Active' as 'Active' | 'Inactive'],
  });

  openAddModal() {
    this.editingClientId.set(null);
    this.form.reset({ name: '', company: '', email: '', phone: '', status: 'Active' });
    this.showModal.set(true);
  }

  openEditModal(client: Client) {
    this.editingClientId.set(client.id);
    this.form.patchValue({
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      status: client.status,
    });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveClient() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const id = this.editingClientId();
    if (id) {
      this.clientService.updateClient(id, value);
    } else {
      this.clientService.addClient(value);
    }
    this.closeModal();
  }

  async deleteClient(id: number) {
    const confirmed = await this.popupService.confirm({
      title: 'Delete Client',
      message: 'Are you sure? This will also remove related projects and invoices.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
    if (confirmed) {
      this.clientService.deleteClient(id);
    }
  }
}
