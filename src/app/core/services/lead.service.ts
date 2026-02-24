import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';

export interface Lead {
  id: number;
  title: string;
  company: string;
  value: number;
  status: 'New' | 'Contacted' | 'Proposal Sent' | 'Won' | 'Lost';
  date: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private api = inject(ApiService);
  private leadsSignal = signal<Lead[]>([]);
  loading = signal(false);

  readonly leads = this.leadsSignal.asReadonly();

  readonly newLeads = computed(() => this.leadsSignal().filter(l => l.status === 'New'));
  readonly contactedLeads = computed(() => this.leadsSignal().filter(l => l.status === 'Contacted'));
  readonly proposalLeads = computed(() => this.leadsSignal().filter(l => l.status === 'Proposal Sent'));
  readonly wonLeads = computed(() => this.leadsSignal().filter(l => l.status === 'Won'));

  private nextTempId = -1;

  loadLeads() {
    this.loading.set(true);
    this.api.get<Lead[]>('/leads').subscribe({
      next: (leads) => {
        this.leadsSignal.set(leads);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  addLead(lead: Omit<Lead, 'id' | 'date'>) {
    const tempId = this.nextTempId--;
    const optimistic = { ...lead, id: tempId, date: 'Just now' } as Lead;
    this.leadsSignal.update(leads => [optimistic, ...leads]);

    this.api.post<Lead>('/leads', lead).subscribe({
      next: (serverLead) => {
        this.leadsSignal.update(leads =>
          leads.map(l => l.id === tempId ? serverLead : l)
        );
      },
      error: () => {
        this.leadsSignal.update(leads => leads.filter(l => l.id !== tempId));
      },
    });
  }

  updateLead(id: number, updatedLead: Partial<Lead>) {
    const previous = this.leadsSignal().find(l => l.id === id);
    this.leadsSignal.update(leads =>
      leads.map(l => l.id === id ? { ...l, ...updatedLead } : l)
    );

    this.api.put<Lead>(`/leads/${id}`, updatedLead).subscribe({
      next: (serverLead) => {
        this.leadsSignal.update(leads =>
          leads.map(l => l.id === id ? serverLead : l)
        );
      },
      error: () => {
        if (previous) {
          this.leadsSignal.update(leads =>
            leads.map(l => l.id === id ? previous : l)
          );
        }
      },
    });
  }

  updateLeadStatus(id: number, status: Lead['status']) {
    const previous = this.leadsSignal().find(l => l.id === id);
    this.leadsSignal.update(leads =>
      leads.map(l => l.id === id ? { ...l, status } : l)
    );

    this.api.patch<Lead>(`/leads/${id}/status`, { status }).subscribe({
      next: (serverLead) => {
        this.leadsSignal.update(leads =>
          leads.map(l => l.id === id ? serverLead : l)
        );
      },
      error: () => {
        if (previous) {
          this.leadsSignal.update(leads =>
            leads.map(l => l.id === id ? previous : l)
          );
        }
      },
    });
  }

  deleteLead(id: number) {
    const previous = this.leadsSignal();
    this.leadsSignal.update(leads => leads.filter(l => l.id !== id));

    this.api.delete(`/leads/${id}`).subscribe({
      error: () => {
        this.leadsSignal.set(previous);
      },
    });
  }

  clearData() {
    this.leadsSignal.set([]);
  }
}
