import { Injectable, signal, computed } from '@angular/core';

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
  private leadsSignal = signal<Lead[]>([
    { id: 1, title: 'E-commerce Platform', company: 'Global Retail Inc.', value: 5000, status: 'New', date: '2d ago', type: 'Web Dev' },
    { id: 2, title: 'Logo Redesign', company: 'Startup X', value: 800, status: 'New', date: '4d ago', type: 'Design' },
    { id: 3, title: 'SEO Audit', company: 'Local Shop', value: 1200, status: 'Contacted', date: '1w ago', type: 'Consulting' },
    { id: 4, title: 'Corporate Site', company: 'Big Corp', value: 12000, status: 'Proposal Sent', date: '3d ago', type: 'Web Dev' },
  ]);

  readonly leads = this.leadsSignal.asReadonly();

  readonly newLeads = computed(() => this.leadsSignal().filter(l => l.status === 'New'));
  readonly contactedLeads = computed(() => this.leadsSignal().filter(l => l.status === 'Contacted'));
  readonly proposalLeads = computed(() => this.leadsSignal().filter(l => l.status === 'Proposal Sent'));
  readonly wonLeads = computed(() => this.leadsSignal().filter(l => l.status === 'Won'));

  addLead(lead: Omit<Lead, 'id' | 'date'>) {
    const newLead = { ...lead, id: Date.now(), date: 'Just now' };
    this.leadsSignal.update(leads => [...leads, newLead]);
  }

  updateLeadStatus(id: number, status: Lead['status']) {
    this.leadsSignal.update(leads => 
      leads.map(l => l.id === id ? { ...l, status } : l)
    );
  }

  deleteLead(id: number) {
    this.leadsSignal.update(leads => leads.filter(l => l.id !== id));
  }
}
