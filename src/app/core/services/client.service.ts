import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';

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
  private api = inject(ApiService);
  private clientsSignal = signal<Client[]>([]);
  loading = signal(false);

  readonly clients = this.clientsSignal.asReadonly();
  
  readonly activeClientsCount = computed(() => 
    this.clientsSignal().filter(c => c.status === 'Active').length
  );

  loadClients() {
    this.loading.set(true);
    this.api.get<Client[]>('/clients').subscribe({
      next: (clients) => {
        this.clientsSignal.set(clients);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  addClient(client: Omit<Client, 'id'>) {
    this.api.post<Client>('/clients', client).subscribe({
      next: (newClient) => {
        this.clientsSignal.update(clients => [newClient, ...clients]);
      },
    });
  }

  updateClient(id: number, updatedClient: Partial<Client>) {
    this.api.put<Client>(`/clients/${id}`, updatedClient).subscribe({
      next: (updated) => {
        this.clientsSignal.update(clients => 
          clients.map(c => c.id === id ? updated : c)
        );
      },
    });
  }

  deleteClient(id: number) {
    this.api.delete(`/clients/${id}`).subscribe({
      next: () => {
        this.clientsSignal.update(clients => clients.filter(c => c.id !== id));
      },
    });
  }

  clearData() {
    this.clientsSignal.set([]);
  }
}
