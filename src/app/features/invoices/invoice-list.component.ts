import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InvoiceService, Invoice } from '../../core/services/invoice.service';
import { ClientService } from '../../core/services/client.service';
import { PopupService } from '../../core/services/popup.service';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-invoice-list',
  imports: [FormsModule, DecimalPipe],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-bold text-white">Invoices</h2>
          <p class="text-gray-400 mt-1">Manage payments and track revenue</p>
        </div>
        <button (click)="openAddModal()" class="bg-orange-500 text-black font-semibold px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create Invoice
        </button>
      </div>

      <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-900">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Invoice</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-gray-800 divide-y divide-gray-700">
            @for (invoice of invoiceService.invoices(); track invoice.id) {
              <tr class="hover:bg-gray-750 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-white">{{ invoice.number }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-300">{{ invoice.client }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-400">{{ invoice.date }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-orange-500">\${{ invoice.amount | number: '1.2-2' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusClass(invoice.status)">
                    {{ invoice.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex gap-2">
                    @if (invoice.status !== 'Paid') {
                      <button (click)="markAsPaid(invoice.id)" class="text-green-400 hover:text-green-300" aria-label="Mark as paid">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </button>
                    }
                    <button (click)="openEditModal(invoice)" class="text-orange-400 hover:text-orange-300" aria-label="Edit invoice">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button (click)="deleteInvoice(invoice.id)" class="text-red-400 hover:text-red-300" aria-label="Delete invoice">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Invoice Modal -->
    @if (showModal) {
      <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" (click)="showModal = false">
        <div class="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-gray-700" (click)="$event.stopPropagation()">
          <h3 class="text-2xl font-bold text-white mb-6">{{ editingInvoiceId ? 'Edit Invoice' : 'Create New Invoice' }}</h3>
          <form (submit)="saveInvoice(); $event.preventDefault()" class="space-y-4">
            <div>
              <label for="invoice-number" class="block text-sm font-medium text-gray-300 mb-2">Invoice Number</label>
              <input [(ngModel)]="formInvoice.number" name="number" id="invoice-number" type="text" required placeholder="INV-004" class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
            </div>
            <div>
              <label for="invoice-client" class="block text-sm font-medium text-gray-300 mb-2">Client</label>
              <select [(ngModel)]="formInvoice.clientId" name="clientId" id="invoice-client" required class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
                <option [ngValue]="0" disabled>Select a client</option>
                @for (client of clientService.clients(); track client.id) {
                  <option [ngValue]="client.id">{{ client.name }}</option>
                }
              </select>
            </div>
            <div>
              <label for="invoice-date" class="block text-sm font-medium text-gray-300 mb-2">Date</label>
              <input [(ngModel)]="formInvoice.date" name="date" id="invoice-date" type="date" required class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
            </div>
            <div>
              <label for="invoice-amount" class="block text-sm font-medium text-gray-300 mb-2">Amount ($)</label>
              <input [(ngModel)]="formInvoice.amount" name="amount" id="invoice-amount" type="number" step="0.01" required class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
            </div>
            <div>
              <label for="invoice-status" class="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select [(ngModel)]="formInvoice.status" name="status" id="invoice-status" class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div class="flex gap-3 mt-6">
              <button type="button" (click)="showModal = false" class="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Cancel
              </button>
              <button type="submit" class="flex-1 px-4 py-2 bg-orange-500 text-black font-semibold rounded-lg hover:bg-orange-600 transition-colors">
                {{ editingInvoiceId ? 'Save Changes' : 'Create Invoice' }}
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
export class InvoiceListComponent {
  private readonly popupService = inject(PopupService);
  invoiceService = inject(InvoiceService);
  clientService = inject(ClientService);
  showModal = false;
  editingInvoiceId: number | null = null;
  formInvoice = {
    number: '',
    clientId: 0,
    date: '',
    amount: 0,
    status: 'Pending' as 'Paid' | 'Pending' | 'Overdue'
  };

  private resetForm() {
    this.formInvoice = {
      number: '',
      clientId: 0,
      date: '',
      amount: 0,
      status: 'Pending'
    };
    this.editingInvoiceId = null;
  }

  openAddModal() {
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(invoice: Invoice) {
    this.editingInvoiceId = invoice.id;
    this.formInvoice = {
      number: invoice.number,
      clientId: invoice.clientId ?? 0,
      date: invoice.date,
      amount: invoice.amount,
      status: invoice.status,
    };
    this.showModal = true;
  }

  saveInvoice() {
    if (this.editingInvoiceId) {
      this.invoiceService.updateInvoice(this.editingInvoiceId, this.formInvoice);
    } else {
      this.invoiceService.addInvoice(this.formInvoice as any);
    }
    this.resetForm();
    this.showModal = false;
  }

  markAsPaid(id: number) {
    this.invoiceService.updateInvoiceStatus(id, 'Paid');
  }

  async deleteInvoice(id: number) {
    const confirmed = await this.popupService.confirm({
      title: 'Delete Invoice',
      message: 'Are you sure you want to delete this invoice? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
    if (confirmed) {
      this.invoiceService.deleteInvoice(id);
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Paid': return 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500/20 text-green-400 border border-green-500/30';
      case 'Pending': return 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'Overdue': return 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-500/20 text-red-400 border border-red-500/30';
      default: return 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  }
}
