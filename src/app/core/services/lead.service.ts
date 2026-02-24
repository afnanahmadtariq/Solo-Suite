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
    this.api.post<Lead>('/leads', lead).subscribe({
      next: (newLead) => {
        this.leadsSignal.update(leads => [newLead, ...leads]);
      },
    });
  }

  updateLead(id: number, updatedLead: Partial<Lead>) {
    this.api.put<Lead>(`/leads/${id}`, updatedLead).subscribe({
      next: (updated) => {
        this.leadsSignal.update(leads =>
          leads.map(l => l.id === id ? updated : l)
        );
      },
    });
  }

  updateLeadStatus(id: number, status: Lead['status']) {
    this.api.patch<Lead>(`/leads/${id}/status`, { status }).subscribe({
      next: (updated) => {
        this.leadsSignal.update(leads =>
          leads.map(l => l.id === id ? updated : l)
        );
      },
    });
  }

  deleteLead(id: number) {
    this.api.delete(`/leads/${id}`).subscribe({
      next: () => {
        this.leadsSignal.update(leads => leads.filter(l => l.id !== id));
      },
    });
  }

  clearData() {
    this.leadsSignal.set([]);
  }
}
