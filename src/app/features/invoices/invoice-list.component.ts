import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { InvoiceService, Invoice } from '../../core/services/invoice.service';
import { ClientService } from '../../core/services/client.service';
import { PopupService } from '../../core/services/popup.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-invoice-list',
  imports: [ReactiveFormsModule, DecimalPipe],
  template: `
    <div class="space-y-4 sm:space-y-6">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-heading tracking-tight">Invoices</h2>
          <p class="text-subtle mt-1 text-sm">Manage payments and track revenue</p>
        </div>
        <button (click)="openAddModal()" class="btn-primary self-start sm:self-auto">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Create Invoice
        </button>
      </div>

      <!-- Desktop Table -->
      <div class="table-container hidden md:block">
        <table class="min-w-full divide-y divide-theme">
          <thead class="table-header">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Invoice</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Client</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
              <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-muted uppercase tracking-wider">Amount</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-subtle">
            @for (invoice of invoiceService.invoices(); track invoice.id) {
              <tr class="table-row transition-colors">
                <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-semibold text-heading font-mono">{{ invoice.number }}</div></td>
                <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-body">{{ invoice.client }}</div></td>
                <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-subtle">{{ invoice.date }}</div></td>
                <td class="px-6 py-4 whitespace-nowrap text-right"><div class="text-sm font-bold text-orange-500">\${{ invoice.amount | number: '1.2-2' }}</div></td>
                <td class="px-6 py-4 whitespace-nowrap"><span [class]="getStatusClass(invoice.status)">{{ invoice.status }}</span></td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex gap-1 justify-end">
                    @if (invoice.status !== 'Paid') {
                      <button (click)="markAsPaid(invoice.id)" class="p-2 text-muted hover:text-emerald-500 active:text-emerald-600 hover:bg-emerald-500/10 active:bg-emerald-500/20 active:scale-95 rounded-lg transition-all" aria-label="Mark as paid"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button>
                    }
                    <button (click)="openEditModal(invoice)" class="p-2 text-muted hover:text-orange-400 active:text-orange-500 hover:bg-orange-500/10 active:bg-orange-500/20 active:scale-95 rounded-lg transition-all" aria-label="Edit invoice"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                    <button (click)="deleteInvoice(invoice.id)" class="p-2 text-muted hover:text-red-400 active:text-red-500 hover:bg-red-500/10 active:bg-red-500/20 active:scale-95 rounded-lg transition-all" aria-label="Delete invoice"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="6" class="px-6 py-16 text-center text-subtle text-sm">No invoices yet. Click "Create Invoice" to get started.</td></tr>
            }
          </tbody>
        </table>
      </div>
      <!-- Mobile Card View -->
      <div class="md:hidden space-y-3">
        @for (invoice of invoiceService.invoices(); track invoice.id) {
          <div class="card p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-heading font-mono">{{ invoice.number }}</span>
              <span [class]="getStatusClass(invoice.status)">{{ invoice.status }}</span>
            </div>
            <div class="text-sm text-body mb-1">{{ invoice.client }}</div>
            <div class="text-xs text-subtle mb-3">{{ invoice.date }}</div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-orange-500">\${{ invoice.amount | number: '1.2-2' }}</span>
              <div class="flex items-center gap-1">
                @if (invoice.status !== 'Paid') {
                  <button (click)="markAsPaid(invoice.id)" class="p-1.5 text-muted hover:text-emerald-500 rounded-lg transition-all" aria-label="Mark as paid"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button>
                }
                <button (click)="openEditModal(invoice)" class="p-1.5 text-muted hover:text-orange-400 rounded-lg transition-all" aria-label="Edit invoice"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                <button (click)="deleteInvoice(invoice.id)" class="p-1.5 text-muted hover:text-red-400 rounded-lg transition-all" aria-label="Delete invoice"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="py-16 text-center text-subtle text-sm">No invoices yet. Click "Create Invoice" to get started.</div>
        }
      </div>
    </div>

    @if (showModal()) {
      <div class="fixed inset-0 bg-overlay backdrop-blur-sm flex items-end sm:items-center justify-center z-50 modal-backdrop" (click)="closeModal()">
        <div class="rounded-t-xl sm:rounded-xl p-5 sm:p-8 max-w-md w-full border border-theme shadow-2xl modal-panel max-h-[90vh] overflow-y-auto" style="background:var(--modal-bg)" (click)="$event.stopPropagation()">
          <h3 class="text-xl font-bold text-heading mb-6">{{ editingInvoiceId() ? 'Edit Invoice' : 'Create New Invoice' }}</h3>
          <form [formGroup]="form" (ngSubmit)="saveInvoice()" class="space-y-5">
            <div>
              <label for="invoice-number" class="form-label">Invoice Number *</label>
              <input formControlName="number" id="invoice-number" type="text" class="form-input font-mono" placeholder="INV-1001">
              @if (form.get('number')?.touched && form.get('number')?.errors?.['required']) { <p class="field-error">Invoice number is required</p> }
              @if (form.get('number')?.touched && form.get('number')?.errors?.['pattern']) { <p class="field-error">Format: INV-XXXX (e.g. INV-1001)</p> }
            </div>
            <div>
              <label for="invoice-client" class="form-label">Client *</label>
              <select formControlName="clientId" id="invoice-client" class="form-select">
                <option [value]="0" disabled>Select a client</option>
                @for (client of clientService.clients(); track client.id) { <option [value]="client.id">{{ client.name }}</option> }
              </select>
              @if (form.get('clientId')?.touched && form.get('clientId')?.errors?.['min']) { <p class="field-error">Please select a client</p> }
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="invoice-date" class="form-label">Date *</label>
                <input formControlName="date" id="invoice-date" type="date" class="form-input">
                @if (form.get('date')?.touched && form.get('date')?.errors?.['required']) { <p class="field-error">Date is required</p> }
              </div>
              <div>
                <label for="invoice-amount" class="form-label">Amount ($) *</label>
                <input formControlName="amount" id="invoice-amount" type="number" step="0.01" class="form-input" placeholder="1500.00">
                @if (form.get('amount')?.touched && form.get('amount')?.errors?.['required']) { <p class="field-error">Amount is required</p> }
                @if (form.get('amount')?.touched && form.get('amount')?.errors?.['min']) { <p class="field-error">Must be > 0</p> }
              </div>
            </div>
            <div>
              <label for="invoice-status" class="form-label">Status</label>
              <select formControlName="status" id="invoice-status" class="form-select">
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div class="flex gap-3 pt-2">
              <button type="button" (click)="closeModal()" class="btn-secondary flex-1">Cancel</button>
              <button type="submit" [disabled]="form.invalid" class="btn-primary flex-1">{{ editingInvoiceId() ? 'Save Changes' : 'Create Invoice' }}</button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceListComponent {
  private readonly popupService = inject(PopupService);
  private readonly fb = inject(FormBuilder);
  invoiceService = inject(InvoiceService);
  clientService = inject(ClientService);
  showModal = signal(false);
  editingInvoiceId = signal<number | null>(null);

  form = this.fb.nonNullable.group({
    number: ['', [Validators.required, Validators.pattern(/^INV-\d+$/)]],
    clientId: [0, [Validators.required, Validators.min(1)]],
    date: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    status: ['Pending' as 'Paid' | 'Pending' | 'Overdue'],
  });

  openAddModal() { this.editingInvoiceId.set(null); this.form.reset({ number: '', clientId: 0, date: '', amount: 0, status: 'Pending' }); this.showModal.set(true); }
  openEditModal(invoice: Invoice) { this.editingInvoiceId.set(invoice.id); this.form.patchValue({ number: invoice.number, clientId: invoice.clientId ?? 0, date: invoice.date, amount: invoice.amount, status: invoice.status }); this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }
  saveInvoice() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue(); const id = this.editingInvoiceId();
    id ? this.invoiceService.updateInvoice(id, v) : this.invoiceService.addInvoice(v as any);
    this.closeModal();
  }
  markAsPaid(id: number) { this.invoiceService.updateInvoiceStatus(id, 'Paid'); }
  async deleteInvoice(id: number) {
    if (await this.popupService.confirm({ title: 'Delete Invoice', message: 'Are you sure you want to delete this invoice?', confirmText: 'Delete', cancelText: 'Cancel', type: 'danger' }))
      this.invoiceService.deleteInvoice(id);
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'Paid': return 'badge bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/30';
      case 'Pending': return 'badge bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/30';
      case 'Overdue': return 'badge bg-red-500/15 text-red-500 ring-1 ring-red-500/30';
      default: return 'badge bg-gray-500/15 text-muted ring-1 ring-gray-500/30';
    }
  }
}
