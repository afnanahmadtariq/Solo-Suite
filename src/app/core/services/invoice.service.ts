import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';

export interface Invoice {
  id: number;
  number: string;
  client: string;
  clientId?: number;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private api = inject(ApiService);
  private invoicesSignal = signal<Invoice[]>([]);
  loading = signal(false);

  readonly invoices = this.invoicesSignal.asReadonly();

  readonly totalRevenue = computed(() =>
    this.invoicesSignal()
      .filter(i => i.status === 'Paid')
      .reduce((sum, i) => sum + i.amount, 0)
  );

  readonly pendingAmount = computed(() =>
    this.invoicesSignal()
      .filter(i => i.status === 'Pending' || i.status === 'Overdue')
      .reduce((sum, i) => sum + i.amount, 0)
  );

  readonly overdueCount = computed(() =>
    this.invoicesSignal().filter(i => i.status === 'Overdue').length
  );

  loadInvoices() {
    this.loading.set(true);
    this.api.get<Invoice[]>('/invoices').subscribe({
      next: (invoices) => {
        this.invoicesSignal.set(invoices);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  addInvoice(invoice: Omit<Invoice, 'id'>) {
    this.api.post<Invoice>('/invoices', invoice).subscribe({
      next: (newInvoice) => {
        this.invoicesSignal.update(invoices => [newInvoice, ...invoices]);
      },
    });
  }

  updateInvoice(id: number, updatedInvoice: Partial<Invoice>) {
    this.api.put<Invoice>(`/invoices/${id}`, updatedInvoice).subscribe({
      next: (updated) => {
        this.invoicesSignal.update(invoices =>
          invoices.map(i => i.id === id ? updated : i)
        );
      },
    });
  }

  updateInvoiceStatus(id: number, status: Invoice['status']) {
    this.api.patch<Invoice>(`/invoices/${id}/status`, { status }).subscribe({
      next: (updated) => {
        this.invoicesSignal.update(invoices =>
          invoices.map(i => i.id === id ? updated : i)
        );
      },
    });
  }

  deleteInvoice(id: number) {
    this.api.delete(`/invoices/${id}`).subscribe({
      next: () => {
        this.invoicesSignal.update(invoices => invoices.filter(i => i.id !== id));
      },
    });
  }

  clearData() {
    this.invoicesSignal.set([]);
  }
}
