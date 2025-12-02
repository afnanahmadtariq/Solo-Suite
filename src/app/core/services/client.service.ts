import { Injectable, signal, computed } from '@angular/core';

export interface Client {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clientsSignal = signal<Client[]>([
    { id: 1, name: 'Jane Cooper', company: 'Acme Corp', email: 'jane@acme.com', phone: '+1 555-0123', status: 'Active' },
    { id: 2, name: 'Cody Fisher', company: 'TechStart', email: 'cody@techstart.io', phone: '+1 555-0124', status: 'Active' },
    { id: 3, name: 'Esther Howard', company: 'Design Co', email: 'esther@design.co', phone: '+1 555-0125', status: 'Inactive' },
  ]);

  readonly clients = this.clientsSignal.asReadonly();
  
  readonly activeClientsCount = computed(() => 
    this.clientsSignal().filter(c => c.status === 'Active').length
  );

  addClient(client: Omit<Client, 'id'>) {
    const newClient = { ...client, id: Date.now() };
    this.clientsSignal.update(clients => [...clients, newClient]);
  }

  updateClient(id: number, updatedClient: Partial<Client>) {
    this.clientsSignal.update(clients => 
      clients.map(c => c.id === id ? { ...c, ...updatedClient } : c)
    );
  }

  deleteClient(id: number) {
    this.clientsSignal.update(clients => clients.filter(c => c.id !== id));
  }
}
