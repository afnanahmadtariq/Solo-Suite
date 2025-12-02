import { Injectable, signal, computed } from '@angular/core';

export interface Invoice {
  id: number;
  number: string;
  client: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private invoicesSignal = signal<Invoice[]>([
    { id: 1, number: 'INV-001', client: 'Acme Corp', date: 'Dec 01, 2025', amount: 1200.00, status: 'Paid' },
    { id: 2, number: 'INV-002', client: 'TechStart', date: 'Dec 05, 2025', amount: 3500.00, status: 'Pending' },
    { id: 3, number: 'INV-003', client: 'Design Co', date: 'Nov 20, 2025', amount: 850.00, status: 'Overdue' },
  ]);

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

  addInvoice(invoice: Omit<Invoice, 'id'>) {
    const newInvoice = { ...invoice, id: Date.now() };
    this.invoicesSignal.update(invoices => [...invoices, newInvoice]);
  }

  updateInvoiceStatus(id: number, status: Invoice['status']) {
    this.invoicesSignal.update(invoices => 
      invoices.map(i => i.id === id ? { ...i, status } : i)
    );
  }

  deleteInvoice(id: number) {
    this.invoicesSignal.update(invoices => invoices.filter(i => i.id !== id));
  }
}
