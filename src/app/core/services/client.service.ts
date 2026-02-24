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

  private nextTempId = -1;

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
    const tempId = this.nextTempId--;
    const optimistic = { ...client, id: tempId } as Client;
    this.clientsSignal.update(clients => [optimistic, ...clients]);

    this.api.post<Client>('/clients', client).subscribe({
      next: (serverClient) => {
        this.clientsSignal.update(clients =>
          clients.map(c => c.id === tempId ? serverClient : c)
        );
      },
      error: () => {
        this.clientsSignal.update(clients => clients.filter(c => c.id !== tempId));
      },
    });
  }

  updateClient(id: number, updatedClient: Partial<Client>) {
    const previous = this.clientsSignal().find(c => c.id === id);
    this.clientsSignal.update(clients =>
      clients.map(c => c.id === id ? { ...c, ...updatedClient } : c)
    );

    this.api.put<Client>(`/clients/${id}`, updatedClient).subscribe({
      next: (serverClient) => {
        this.clientsSignal.update(clients =>
          clients.map(c => c.id === id ? serverClient : c)
        );
      },
      error: () => {
        if (previous) {
          this.clientsSignal.update(clients =>
            clients.map(c => c.id === id ? previous : c)
          );
        }
      },
    });
  }

  deleteClient(id: number) {
    const previous = this.clientsSignal();
    this.clientsSignal.update(clients => clients.filter(c => c.id !== id));

    this.api.delete(`/clients/${id}`).subscribe({
      error: () => {
        this.clientsSignal.set(previous);
      },
    });
  }

  clearData() {
    this.clientsSignal.set([]);
  }
}
