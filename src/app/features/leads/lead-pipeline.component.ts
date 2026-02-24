import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LeadService, Lead } from '../../core/services/lead.service';
import { PopupService } from '../../core/services/popup.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-lead-pipeline',
  imports: [ReactiveFormsModule, DecimalPipe],
  template: `
    <div class="space-y-6 h-full flex flex-col">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-extrabold text-white tracking-tight">Leads Pipeline</h2>
          <p class="text-gray-500 mt-1 text-sm">Track your opportunities from prospect to close</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
            <button
              (click)="viewMode.set('pipeline')"
              [class]="viewMode() === 'pipeline' ? 'bg-orange-500 text-black shadow-md' : 'text-gray-400 hover:text-white'"
              class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5"
              aria-label="Pipeline view">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
              Pipeline
            </button>
            <button
              (click)="viewMode.set('table')"
              [class]="viewMode() === 'table' ? 'bg-orange-500 text-black shadow-md' : 'text-gray-400 hover:text-white'"
              class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5"
              aria-label="Table view">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              Table
            </button>
          </div>
          <button (click)="openAddModal()" class="btn-primary">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Add Lead
          </button>
        </div>
      </div>

      @if (viewMode() === 'pipeline') {
        <div class="flex-1 overflow-x-auto pb-4 scrollbar-hidden">
          <div class="flex gap-5 min-w-max">
            <!-- New -->
            <div class="w-80 card p-4">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-semibold text-white text-sm">New Leads</h3>
                <span class="badge bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30">{{ leadService.newLeads().length }}</span>
              </div>
              <div class="space-y-3">
                @for (lead of leadService.newLeads(); track lead.id) {
                  <div class="bg-gray-950 p-4 rounded-lg border border-gray-800 hover:border-sky-500/40 transition-all group">
                    <div class="flex justify-between items-start mb-2">
                      <span class="badge bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30 text-[10px]">{{ lead.type }}</span>
                      <span class="text-[10px] text-gray-600">{{ lead.date }}</span>
                    </div>
                    <h4 class="font-semibold text-white text-sm">{{ lead.title }}</h4>
                    <p class="text-xs text-gray-500 mt-0.5">{{ lead.company }}</p>
                    <div class="mt-3 flex justify-between items-center">
                      <span class="text-sm font-bold text-orange-400">\${{ lead.value | number }}</span>
                      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button (click)="openEditModal(lead)" class="p-1 text-gray-500 hover:text-orange-400 rounded" aria-label="Edit"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                        <button (click)="deleteLead(lead.id)" class="p-1 text-gray-500 hover:text-red-400 rounded" aria-label="Delete"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                        <button (click)="updateStatus(lead.id, 'Contacted')" class="text-[10px] font-semibold text-gray-500 hover:text-orange-400 ml-1">→</button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Contacted -->
            <div class="w-80 card p-4">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-semibold text-white text-sm">Contacted</h3>
                <span class="badge bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30">{{ leadService.contactedLeads().length }}</span>
              </div>
              <div class="space-y-3">
                @for (lead of leadService.contactedLeads(); track lead.id) {
                  <div class="bg-gray-950 p-4 rounded-lg border border-gray-800 hover:border-amber-500/40 transition-all group">
                    <div class="flex justify-between items-start mb-2">
                      <span class="badge bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30 text-[10px]">{{ lead.type }}</span>
                      <span class="text-[10px] text-gray-600">{{ lead.date }}</span>
                    </div>
                    <h4 class="font-semibold text-white text-sm">{{ lead.title }}</h4>
                    <p class="text-xs text-gray-500 mt-0.5">{{ lead.company }}</p>
                    <div class="mt-3 flex justify-between items-center">
                      <span class="text-sm font-bold text-orange-400">\${{ lead.value | number }}</span>
                      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button (click)="openEditModal(lead)" class="p-1 text-gray-500 hover:text-orange-400 rounded" aria-label="Edit"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                        <button (click)="deleteLead(lead.id)" class="p-1 text-gray-500 hover:text-red-400 rounded" aria-label="Delete"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                        <button (click)="updateStatus(lead.id, 'Proposal Sent')" class="text-[10px] font-semibold text-gray-500 hover:text-orange-400 ml-1">→</button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Proposal Sent -->
            <div class="w-80 card p-4">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-semibold text-white text-sm">Proposal Sent</h3>
                <span class="badge bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30">{{ leadService.proposalLeads().length }}</span>
              </div>
              <div class="space-y-3">
                @for (lead of leadService.proposalLeads(); track lead.id) {
                  <div class="bg-gray-950 p-4 rounded-lg border border-gray-800 hover:border-violet-500/40 transition-all group">
                    <div class="flex justify-between items-start mb-2">
                      <span class="badge bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30 text-[10px]">{{ lead.type }}</span>
                      <span class="text-[10px] text-gray-600">{{ lead.date }}</span>
                    </div>
                    <h4 class="font-semibold text-white text-sm">{{ lead.title }}</h4>
                    <p class="text-xs text-gray-500 mt-0.5">{{ lead.company }}</p>
                    <div class="mt-3 flex justify-between items-center">
                      <span class="text-sm font-bold text-orange-400">\${{ lead.value | number }}</span>
                      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button (click)="openEditModal(lead)" class="p-1 text-gray-500 hover:text-orange-400 rounded" aria-label="Edit"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                        <button (click)="deleteLead(lead.id)" class="p-1 text-gray-500 hover:text-red-400 rounded" aria-label="Delete"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                        <button (click)="updateStatus(lead.id, 'Won')" class="text-[10px] font-semibold text-gray-500 hover:text-orange-400 ml-1">→</button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Won -->
            <div class="w-80 card p-4">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-semibold text-white text-sm">Won</h3>
                <span class="badge bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">{{ leadService.wonLeads().length }}</span>
              </div>
              <div class="space-y-3">
                @for (lead of leadService.wonLeads(); track lead.id) {
                  <div class="bg-emerald-950/30 p-4 rounded-lg border border-emerald-500/20 group">
                    <div class="flex justify-between items-start mb-2">
                      <span class="badge bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30 text-[10px]">{{ lead.type }}</span>
                      <span class="text-[10px] text-gray-600">{{ lead.date }}</span>
                    </div>
                    <h4 class="font-semibold text-white text-sm">{{ lead.title }}</h4>
                    <p class="text-xs text-gray-500 mt-0.5">{{ lead.company }}</p>
                    <div class="mt-3 flex justify-between items-center">
                      <span class="text-sm font-bold text-emerald-400">\${{ lead.value | number }}</span>
                      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button (click)="openEditModal(lead)" class="p-1 text-gray-500 hover:text-orange-400 rounded" aria-label="Edit"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                        <button (click)="deleteLead(lead.id)" class="p-1 text-gray-500 hover:text-red-400 rounded" aria-label="Delete"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                      </div>
                    </div>
                  </div>
                }
                @if (leadService.wonLeads().length === 0) {
                  <div class="h-28 border-2 border-dashed border-gray-800 rounded-lg flex items-center justify-center text-gray-600 text-xs">No won deals yet</div>
                }
              </div>
            </div>
          </div>
        </div>
      } @else {
        <!-- Table View -->
        <div class="flex-1 overflow-auto scrollbar-hidden">
          <div class="table-container">
            <table class="min-w-full divide-y divide-gray-800">
              <thead class="table-header">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Lead</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Company</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                  <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Value</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-800/60">
                @for (lead of leadService.leads(); track lead.id) {
                  <tr class="table-row transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-orange-500/20">
                          {{ lead.title.charAt(0) }}
                        </div>
                        <div class="ml-3">
                          <div class="text-sm font-semibold text-white">{{ lead.title }}</div>
                          <div class="text-xs text-gray-600">{{ lead.date }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{{ lead.company }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="badge bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30">{{ lead.type }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right">
                      <span class="text-sm font-bold text-orange-400">\${{ lead.value | number }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span [class]="getStatusClass(lead.status)">{{ lead.status }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right">
                      <div class="flex items-center gap-1 justify-end">
                        @if (lead.status !== 'Won') {
                          <button (click)="updateStatus(lead.id, getNextStatus(lead.status))" class="text-xs font-semibold text-orange-500 hover:text-orange-400 px-2 py-1 hover:bg-orange-500/10 rounded transition-all">
                            → {{ getNextStatus(lead.status) }}
                          </button>
                        } @else {
                          <span class="text-xs font-semibold text-emerald-400 px-2">✓ Won</span>
                        }
                        <button (click)="openEditModal(lead)" class="p-2 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-all" aria-label="Edit"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                        <button (click)="deleteLead(lead.id)" class="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" aria-label="Delete"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="6" class="px-6 py-16 text-center text-gray-500 text-sm">No leads yet. Click "Add Lead" to get started.</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>

    <!-- Add/Edit Lead Modal -->
    @if (showModal()) {
      <div class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 modal-backdrop" (click)="closeModal()">
        <div class="bg-gray-900 rounded-xl p-8 max-w-lg w-full border border-gray-800 shadow-2xl modal-panel" (click)="$event.stopPropagation()">
          <h3 class="text-xl font-bold text-white mb-6">{{ editingLeadId() ? 'Edit Lead' : 'Add New Lead' }}</h3>
          <form [formGroup]="form" (ngSubmit)="saveLead()" class="space-y-5">
            <div>
              <label for="lead-title" class="form-label">Title *</label>
              <input formControlName="title" id="lead-title" type="text" class="form-input" placeholder="SEO Consultation Request">
              @if (form.get('title')?.touched && form.get('title')?.errors?.['required']) {
                <p class="field-error">Title is required</p>
              }
            </div>
            <div>
              <label for="lead-company" class="form-label">Company *</label>
              <input formControlName="company" id="lead-company" type="text" class="form-input" placeholder="Tech Startup LLC">
              @if (form.get('company')?.touched && form.get('company')?.errors?.['required']) {
                <p class="field-error">Company is required</p>
              }
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label for="lead-name" class="form-label">Contact</label>
                <input formControlName="name" id="lead-name" type="text" class="form-input" placeholder="Alice">
              </div>
              <div>
                <label for="lead-email" class="form-label">Email</label>
                <input formControlName="email" id="lead-email" type="email" class="form-input" placeholder="alice@co.com">
                @if (form.get('email')?.touched && form.get('email')?.errors?.['email']) {
                  <p class="field-error">Invalid email</p>
                }
              </div>
              <div>
                <label for="lead-phone" class="form-label">Phone</label>
                <input formControlName="phone" id="lead-phone" type="tel" class="form-input" placeholder="555-987">
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="lead-value" class="form-label">Value ($) *</label>
                <input formControlName="value" id="lead-value" type="number" class="form-input" placeholder="5000">
                @if (form.get('value')?.touched && form.get('value')?.errors?.['required']) {
                  <p class="field-error">Value is required</p>
                }
                @if (form.get('value')?.touched && form.get('value')?.errors?.['min']) {
                  <p class="field-error">Must be > 0</p>
                }
              </div>
              <div>
                <label for="lead-type" class="form-label">Type *</label>
                <input formControlName="type" id="lead-type" type="text" class="form-input" placeholder="Inbound Organic">
                @if (form.get('type')?.touched && form.get('type')?.errors?.['required']) {
                  <p class="field-error">Type is required</p>
                }
              </div>
            </div>
            @if (editingLeadId()) {
              <div>
                <label for="lead-status" class="form-label">Status</label>
                <select formControlName="status" id="lead-status" class="form-select">
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
            }
            <div class="flex gap-3 pt-2">
              <button type="button" (click)="closeModal()" class="btn-secondary flex-1">Cancel</button>
              <button type="submit" [disabled]="form.invalid" class="btn-primary flex-1">
                {{ editingLeadId() ? 'Save Changes' : 'Add Lead' }}
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
  private readonly fb = inject(FormBuilder);
  leadService = inject(LeadService);

  showModal = signal(false);
  viewMode = signal<'pipeline' | 'table'>('pipeline');
  editingLeadId = signal<number | null>(null);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    company: ['', [Validators.required]],
    name: [''],
    email: ['', [Validators.email]],
    phone: [''],
    value: [0, [Validators.required, Validators.min(1)]],
    type: ['', [Validators.required]],
    status: ['New' as Lead['status']],
  });

  openAddModal() {
    this.editingLeadId.set(null);
    this.form.reset({ title: '', company: '', name: '', email: '', phone: '', value: 0, type: '', status: 'New' });
    this.showModal.set(true);
  }

  openEditModal(lead: Lead) {
    this.editingLeadId.set(lead.id);
    this.form.patchValue({
      title: lead.title,
      company: lead.company,
      name: (lead as any).name ?? '',
      email: (lead as any).email ?? '',
      phone: (lead as any).phone ?? '',
      value: lead.value,
      type: lead.type,
      status: lead.status,
    });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveLead() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const id = this.editingLeadId();
    if (id) {
      this.leadService.updateLead(id, value);
    } else {
      this.leadService.addLead(value);
    }
    this.closeModal();
  }

  updateStatus(id: number, status: Lead['status']) {
    this.leadService.updateLeadStatus(id, status);
  }

  async deleteLead(id: number) {
    const confirmed = await this.popupService.confirm({
      title: 'Delete Lead',
      message: 'Are you sure you want to delete this lead?',
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
      case 'New': return 'badge bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30';
      case 'Contacted': return 'badge bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30';
      case 'Proposal Sent': return 'badge bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30';
      case 'Won': return 'badge bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30';
      default: return 'badge bg-gray-500/15 text-gray-400 ring-1 ring-gray-500/30';
    }
  }
}
