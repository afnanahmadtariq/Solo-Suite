import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LeadService, Lead } from '../../core/services/lead.service';
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
        <button (click)="showAddModal = true" class="bg-orange-500 text-black font-semibold px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Lead
        </button>
      </div>

      <div class="flex-1 overflow-x-auto pb-4">
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
                    <button (click)="updateStatus(lead.id, 'Contacted')" class="text-xs text-gray-400 hover:text-orange-500">Move </button>
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
                    <button (click)="updateStatus(lead.id, 'Proposal Sent')" class="text-xs text-gray-400 hover:text-orange-500">Move </button>
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
                    <button (click)="updateStatus(lead.id, 'Won')" class="text-xs text-gray-400 hover:text-orange-500">Move </button>
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
                  <div class="mt-3">
                    <span class="text-sm font-semibold text-green-400">\${{ lead.value | number }}</span>
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
    </div>

    <!-- Add Lead Modal -->
    @if (showAddModal) {
      <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" (click)="showAddModal = false">
        <div class="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-gray-700" (click)="$event.stopPropagation()">
          <h3 class="text-2xl font-bold text-white mb-6">Add New Lead</h3>
          <form (submit)="addLead(); $event.preventDefault()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input [(ngModel)]="newLead.title" name="title" type="text" required class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Company</label>
              <input [(ngModel)]="newLead.company" name="company" type="text" required class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Value ($)</label>
              <input [(ngModel)]="newLead.value" name="value" type="number" required class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <input [(ngModel)]="newLead.type" name="type" type="text" required class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
            </div>
            <div class="flex gap-3 mt-6">
              <button type="button" (click)="showAddModal = false" class="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Cancel
              </button>
              <button type="submit" class="flex-1 px-4 py-2 bg-orange-500 text-black font-semibold rounded-lg hover:bg-orange-600 transition-colors">
                Add Lead
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
  leadService = inject(LeadService);
  showAddModal = false;
  newLead = {
    title: '',
    company: '',
    value: 0,
    type: '',
    status: 'New' as Lead['status']
  };

  addLead() {
    this.leadService.addLead(this.newLead);
    this.newLead = {
      title: '',
      company: '',
      value: 0,
      type: '',
      status: 'New'
    };
    this.showAddModal = false;
  }

  updateStatus(id: number, status: Lead['status']) {
    this.leadService.updateLeadStatus(id, status);
  }
}
