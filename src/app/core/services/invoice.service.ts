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

  private nextTempId = -1;

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
    const payload = {
      ...invoice,
      ...(invoice.clientId != null && { clientId: Number(invoice.clientId) }),
      ...(invoice.amount != null && { amount: Number(invoice.amount) }),
    };
    const tempId = this.nextTempId--;
    const optimistic = { ...payload, id: tempId } as Invoice;
    this.invoicesSignal.update(invoices => [optimistic, ...invoices]);

    this.api.post<Invoice>('/invoices', payload).subscribe({
      next: (serverInvoice) => {
        this.invoicesSignal.update(invoices =>
          invoices.map(i => i.id === tempId ? serverInvoice : i)
        );
      },
      error: () => {
        this.invoicesSignal.update(invoices => invoices.filter(i => i.id !== tempId));
      },
    });
  }

  updateInvoice(id: number, updatedInvoice: Partial<Invoice>) {
    const payload = {
      ...updatedInvoice,
      ...(updatedInvoice.clientId != null && { clientId: Number(updatedInvoice.clientId) }),
      ...(updatedInvoice.amount != null && { amount: Number(updatedInvoice.amount) }),
    };
    const previous = this.invoicesSignal().find(i => i.id === id);
    this.invoicesSignal.update(invoices =>
      invoices.map(i => i.id === id ? { ...i, ...payload } : i)
    );

    this.api.put<Invoice>(`/invoices/${id}`, payload).subscribe({
      next: (serverInvoice) => {
        this.invoicesSignal.update(invoices =>
          invoices.map(i => i.id === id ? serverInvoice : i)
        );
      },
      error: () => {
        if (previous) {
          this.invoicesSignal.update(invoices =>
            invoices.map(i => i.id === id ? previous : i)
          );
        }
      },
    });
  }

  updateInvoiceStatus(id: number, status: Invoice['status']) {
    const previous = this.invoicesSignal().find(i => i.id === id);
    this.invoicesSignal.update(invoices =>
      invoices.map(i => i.id === id ? { ...i, status } : i)
    );

    this.api.patch<Invoice>(`/invoices/${id}/status`, { status }).subscribe({
      next: (serverInvoice) => {
        this.invoicesSignal.update(invoices =>
          invoices.map(i => i.id === id ? serverInvoice : i)
        );
      },
      error: () => {
        if (previous) {
          this.invoicesSignal.update(invoices =>
            invoices.map(i => i.id === id ? previous : i)
          );
        }
      },
    });
  }

  deleteInvoice(id: number) {
    const previous = this.invoicesSignal();
    this.invoicesSignal.update(invoices => invoices.filter(i => i.id !== id));

    this.api.delete(`/invoices/${id}`).subscribe({
      error: () => {
        this.invoicesSignal.set(previous);
      },
    });
  }

  clearData() {
    this.invoicesSignal.set([]);
  }
}
