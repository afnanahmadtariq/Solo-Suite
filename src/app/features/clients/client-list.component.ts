import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ClientService, Client } from '../../core/services/client.service';
import { PopupService } from '../../core/services/popup.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-list',
  imports: [FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-bold text-white">Clients</h2>
          <p class="text-gray-400 mt-1">Manage your client relationships</p>
        </div>
        <button (click)="openAddModal()" class="bg-orange-500 text-black font-semibold px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Client
        </button>
      </div>

      <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-900">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-gray-800 divide-y divide-gray-700">
            @for (client of clientService.clients(); track client.id) {
              <tr class="hover:bg-gray-750 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                      {{ client.name.charAt(0) }}
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-white">{{ client.name }}</div>
                      <div class="text-sm text-gray-400">{{ client.company }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-300">{{ client.email }}</div>
                  <div class="text-sm text-gray-500">{{ client.phone }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="client.status === 'Active' ? 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500/20 text-green-400 border border-green-500/30' : 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30'">
                    {{ client.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex gap-2">
                    <button (click)="openEditModal(client)" class="text-orange-400 hover:text-orange-300" aria-label="Edit client">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button (click)="deleteClient(client.id)" class="text-red-400 hover:text-red-300" aria-label="Delete client">
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

    <!-- Add/Edit Client Modal -->
    @if (showModal) {
      <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" (click)="showModal = false">
        <div class="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-gray-700" (click)="$event.stopPropagation()">
          <h3 class="text-2xl font-bold text-white mb-6">{{ editingClientId ? 'Edit Client' : 'Add New Client' }}</h3>
          <form (submit)="saveClient(); $event.preventDefault()" class="space-y-4">
            <div>
              <label for="client-name" class="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input [(ngModel)]="formClient.name" name="name" id="client-name" type="text" required class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
            </div>
            <div>
              <label for="client-company" class="block text-sm font-medium text-gray-300 mb-2">Company</label>
              <input [(ngModel)]="formClient.company" name="company" id="client-company" type="text" required class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
            </div>
            <div>
              <label for="client-email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input [(ngModel)]="formClient.email" name="email" id="client-email" type="email" required class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
            </div>
            <div>
              <label for="client-phone" class="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <input [(ngModel)]="formClient.phone" name="phone" id="client-phone" type="tel" required class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
            </div>
            <div>
              <label for="client-status" class="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select [(ngModel)]="formClient.status" name="status" id="client-status" class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div class="flex gap-3 mt-6">
              <button type="button" (click)="showModal = false" class="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Cancel
              </button>
              <button type="submit" class="flex-1 px-4 py-2 bg-orange-500 text-black font-semibold rounded-lg hover:bg-orange-600 transition-colors">
                {{ editingClientId ? 'Save Changes' : 'Add Client' }}
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
export class ClientListComponent {
  private readonly popupService = inject(PopupService);
  clientService = inject(ClientService);
  showModal = false;
  editingClientId: number | null = null;
  formClient = {
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'Active' as 'Active' | 'Inactive'
  };

  private resetForm() {
    this.formClient = {
      name: '',
      company: '',
      email: '',
      phone: '',
      status: 'Active'
    };
    this.editingClientId = null;
  }

  openAddModal() {
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(client: Client) {
    this.editingClientId = client.id;
    this.formClient = {
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      status: client.status,
    };
    this.showModal = true;
  }

  saveClient() {
    if (this.editingClientId) {
      this.clientService.updateClient(this.editingClientId, this.formClient);
    } else {
      this.clientService.addClient(this.formClient);
    }
    this.resetForm();
    this.showModal = false;
  }

  async deleteClient(id: number) {
    const confirmed = await this.popupService.confirm({
      title: 'Delete Client',
      message: 'Are you sure you want to delete this client? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
    if (confirmed) {
      this.clientService.deleteClient(id);
    }
  }
}
