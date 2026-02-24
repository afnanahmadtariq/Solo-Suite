import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LeadService, Lead } from '../../core/services/lead.service';
import { PopupService } from '../../core/services/popup.service';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-lead-pipeline',
  imports: [FormsModule, DecimalPipe],
  template: `
    <div class="space-y-6 h-full flex flex-col">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-bold text-white">Leads Pipeline</h2>
          <p class="text-gray-400 mt-1">Track your opportunities from prospect to close</p>
        </div>
        <div class="flex items-center gap-4">
          <!-- View Toggle -->
          <div class="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
            <button 
              (click)="viewMode.set('pipeline')" 
              [class]="viewMode() === 'pipeline' ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-white'"
              class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
              aria-label="Pipeline view"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path>
              </svg>
              Pipeline
            </button>
            <button 
              (click)="viewMode.set('table')" 
              [class]="viewMode() === 'table' ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-white'"
              class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
              aria-label="Table view"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              Table
            </button>
          </div>
          <button (click)="openAddModal()" class="bg-orange-500 text-black font-semibold px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Lead
          </button>
        </div>
      </div>

      @if (viewMode() === 'pipeline') {
        <!-- Pipeline View -->
        <div class="flex-1 overflow-x-auto pb-4 scrollbar-hidden">
          <div class="flex gap-6 min-w-max">
            <!-- New Leads Column -->
            <div class="w-80 bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-semibold text-white">New Leads</h3>
                <span class="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">{{ leadService.newLeads().length }}</span>
              </div>
              <div class="space-y-3">
                @for (lead of leadService.newLeads(); track lead.id) {
                  <div class="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:border-orange-500 transition-all cursor-pointer">
                    <div class="flex justify-between items-start mb-2">
                      <span class="text-xs font-medium bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">{{ lead.type }}</span>
                      <span class="text-xs text-gray-500">{{ lead.date }}</span>
                    </div>
                    <h4 class="font-medium text-white">{{ lead.title }}</h4>
                    <p class="text-sm text-gray-400 mt-1">{{ lead.company }}</p>
                    <div class="mt-3 flex justify-between items-center">
                      <span class="text-sm font-semibold text-orange-500">\${{ lead.value | number }}</span>
                      <div class="flex items-center gap-2">
                        <button (click)="openEditModal(lead)" class="text-xs text-gray-400 hover:text-orange-500" aria-label="Edit lead">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                        <button (click)="deleteLead(lead.id)" class="text-xs text-gray-400 hover:text-red-400" aria-label="Delete lead">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                        <button (click)="updateStatus(lead.id, 'Contacted')" class="text-xs text-gray-400 hover:text-orange-500">Move →</button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Contacted Column -->
            <div class="w-80 bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-semibold text-white">Contacted</h3>
                <span class="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">{{ leadService.contactedLeads().length }}</span>
              </div>
              <div class="space-y-3">
                @for (lead of leadService.contactedLeads(); track lead.id) {
                  <div class="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:border-orange-500 transition-all cursor-pointer">
                    <div class="flex justify-between items-start mb-2">
                      <span class="text-xs font-medium bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30">{{ lead.type }}</span>
                      <span class="text-xs text-gray-500">{{ lead.date }}</span>
                    </div>
                    <h4 class="font-medium text-white">{{ lead.title }}</h4>
                    <p class="text-sm text-gray-400 mt-1">{{ lead.company }}</p>
                    <div class="mt-3 flex justify-between items-center">
                      <span class="text-sm font-semibold text-orange-500">\${{ lead.value | number }}</span>
                      <div class="flex items-center gap-2">
                        <button (click)="openEditModal(lead)" class="text-xs text-gray-400 hover:text-orange-500" aria-label="Edit lead">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                        <button (click)="deleteLead(lead.id)" class="text-xs text-gray-400 hover:text-red-400" aria-label="Delete lead">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                        <button (click)="updateStatus(lead.id, 'Proposal Sent')" class="text-xs text-gray-400 hover:text-orange-500">Move →</button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Proposal Sent Column -->
            <div class="w-80 bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-semibold text-white">Proposal Sent</h3>
                <span class="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">{{ leadService.proposalLeads().length }}</span>
              </div>
              <div class="space-y-3">
                @for (lead of leadService.proposalLeads(); track lead.id) {
                  <div class="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:border-orange-500 transition-all cursor-pointer">
                    <div class="flex justify-between items-start mb-2">
                      <span class="text-xs font-medium bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30">{{ lead.type }}</span>
                      <span class="text-xs text-gray-500">{{ lead.date }}</span>
                    </div>
                    <h4 class="font-medium text-white">{{ lead.title }}</h4>
                    <p class="text-sm text-gray-400 mt-1">{{ lead.company }}</p>
                    <div class="mt-3 flex justify-between items-center">
                      <span class="text-sm font-semibold text-orange-500">\${{ lead.value | number }}</span>
                      <div class="flex items-center gap-2">
                        <button (click)="openEditModal(lead)" class="text-xs text-gray-400 hover:text-orange-500" aria-label="Edit lead">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                        <button (click)="deleteLead(lead.id)" class="text-xs text-gray-400 hover:text-red-400" aria-label="Delete lead">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                        <button (click)="updateStatus(lead.id, 'Won')" class="text-xs text-gray-400 hover:text-orange-500">Move →</button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Won Column -->
            <div class="w-80 bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-semibold text-white">Won</h3>
                <span class="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">{{ leadService.wonLeads().length }}</span>
              </div>
              <div class="space-y-3">
                @for (lead of leadService.wonLeads(); track lead.id) {
                  <div class="bg-gradient-to-br from-green-900/30 to-green-800/20 p-4 rounded-lg border border-green-500/30">
                    <div class="flex justify-between items-start mb-2">
                      <span class="text-xs font-medium bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30">{{ lead.type }}</span>
                      <span class="text-xs text-gray-500">{{ lead.date }}</span>
                    </div>
                    <h4 class="font-medium text-white">{{ lead.title }}</h4>
                    <p class="text-sm text-gray-400 mt-1">{{ lead.company }}</p>
                    <div class="mt-3 flex justify-between items-center">
                      <span class="text-sm font-semibold text-green-400">\${{ lead.value | number }}</span>
                      <div class="flex items-center gap-2">
                        <button (click)="openEditModal(lead)" class="text-xs text-gray-400 hover:text-orange-500" aria-label="Edit lead">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                        <button (click)="deleteLead(lead.id)" class="text-xs text-gray-400 hover:text-red-400" aria-label="Delete lead">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                }
                @if (leadService.wonLeads().length === 0) {
                  <div class="h-32 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                    No won deals yet
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      } @else {
        <!-- Table View -->
        <div class="flex-1 overflow-auto scrollbar-hidden">
          <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            <table class="min-w-full divide-y divide-gray-700">
              <thead class="bg-gray-900">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Lead</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Company</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-gray-800 divide-y divide-gray-700">
                @for (lead of leadService.leads(); track lead.id) {
                  <tr class="hover:bg-gray-750 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                          {{ lead.title.charAt(0) }}
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-white">{{ lead.title }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-300">{{ lead.company }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 py-1 text-xs font-medium rounded border bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {{ lead.type }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-semibold text-orange-500">\${{ lead.value | number }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span [class]="getStatusClass(lead.status)">
                        {{ lead.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {{ lead.date }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      <div class="flex items-center gap-3">
                        @if (lead.status !== 'Won') {
                          <button 
                            (click)="updateStatus(lead.id, getNextStatus(lead.status))" 
                            class="text-orange-500 hover:text-orange-400 font-medium"
                          >
                            Move to {{ getNextStatus(lead.status) }}
                          </button>
                        } @else {
                          <span class="text-green-400 font-medium">✓ Won</span>
                        }
                        <button (click)="openEditModal(lead)" class="text-orange-400 hover:text-orange-300" aria-label="Edit lead">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                        <button (click)="deleteLead(lead.id)" class="text-red-400 hover:text-red-300" aria-label="Delete lead">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                      No leads yet. Click "Add Lead" to get started.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>

    <!-- Add/Edit Lead Modal -->
    @if (showModal) {
      <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" (click)="showModal = false">
        <div class="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-gray-700" (click)="$event.stopPropagation()">
          <h3 class="text-2xl font-bold text-white mb-6">{{ editingLeadId ? 'Edit Lead' : 'Add New Lead' }}</h3>
          <form (submit)="saveLead(); $event.preventDefault()" class="space-y-4">
            <div>
              <label for="lead-title" class="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input [(ngModel)]="formLead.title" name="title" id="lead-title" type="text" required class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
            </div>
            <div>
              <label for="lead-company" class="block text-sm font-medium text-gray-300 mb-2">Company</label>
              <input [(ngModel)]="formLead.company" name="company" id="lead-company" type="text" required class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="lead-name" class="block text-sm font-medium text-gray-300 mb-2">Contact Name</label>
                <input [(ngModel)]="formLead.name" name="name" id="lead-name" type="text" class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
              </div>
              <div>
                <label for="lead-email" class="block text-sm font-medium text-gray-300 mb-2">Contact Email</label>
                <input [(ngModel)]="formLead.email" name="email" id="lead-email" type="email" class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="lead-phone" class="block text-sm font-medium text-gray-300 mb-2">Contact Phone</label>
                <input [(ngModel)]="formLead.phone" name="phone" id="lead-phone" type="tel" class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
              </div>
              <div>
                <label for="lead-value" class="block text-sm font-medium text-gray-300 mb-2">Value ($)</label>
                <input [(ngModel)]="formLead.value" name="value" id="lead-value" type="number" required class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="lead-type" class="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <input [(ngModel)]="formLead.type" name="type" id="lead-type" type="text" required class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
              </div>
              @if (editingLeadId) {
                <div>
                  <label for="lead-status" class="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select [(ngModel)]="formLead.status" name="status" id="lead-status" class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              }
            </div>
            <div class="flex gap-3 mt-6">
              <button type="button" (click)="showModal = false" class="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Cancel
              </button>
              <button type="submit" class="flex-1 px-4 py-2 bg-orange-500 text-black font-semibold rounded-lg hover:bg-orange-600 transition-colors">
                {{ editingLeadId ? 'Save Changes' : 'Add Lead' }}
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
export class LeadPipelineComponent {
  private readonly popupService = inject(PopupService);
  leadService = inject(LeadService);
  showModal = false;
  viewMode = signal<'pipeline' | 'table'>('pipeline');
  editingLeadId: number | null = null;
  formLead = {
    title: '',
    company: '',
    name: '',
    email: '',
    phone: '',
    value: 0,
    type: '',
    status: 'New' as Lead['status']
  };

  private resetForm() {
    this.formLead = {
      title: '',
      company: '',
      name: '',
      email: '',
      phone: '',
      value: 0,
      type: '',
      status: 'New'
    };
    this.editingLeadId = null;
  }

  openAddModal() {
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(lead: Lead) {
    this.editingLeadId = lead.id;
    this.formLead = {
      title: lead.title,
      company: lead.company,
      name: (lead as any).name ?? '',
      email: (lead as any).email ?? '',
      phone: (lead as any).phone ?? '',
      value: lead.value,
      type: lead.type,
      status: lead.status,
    };
    this.showModal = true;
  }

  saveLead() {
    if (this.editingLeadId) {
      this.leadService.updateLead(this.editingLeadId, this.formLead);
    } else {
      this.leadService.addLead(this.formLead);
    }
    this.resetForm();
    this.showModal = false;
  }

  updateStatus(id: number, status: Lead['status']) {
    this.leadService.updateLeadStatus(id, status);
  }

  async deleteLead(id: number) {
    const confirmed = await this.popupService.confirm({
      title: 'Delete Lead',
      message: 'Are you sure you want to delete this lead? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });
    if (confirmed) {
      this.leadService.deleteLead(id);
    }
  }

  getNextStatus(currentStatus: Lead['status']): Lead['status'] {
    switch (currentStatus) {
      case 'New': return 'Contacted';
      case 'Contacted': return 'Proposal Sent';
      case 'Proposal Sent': return 'Won';
      default: return 'Won';
    }
  }

  getStatusClass(status: Lead['status']): string {
    switch (status) {
      case 'New': return 'px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'Contacted': return 'px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'Proposal Sent': return 'px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'Won': return 'px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400 border border-green-500/30';
      default: return 'px-3 py-1 text-xs font-semibold rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  }
}
