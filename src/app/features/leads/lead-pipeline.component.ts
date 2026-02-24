import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LeadService, Lead } from '../../core/services/lead.service';
import { PopupService } from '../../core/services/popup.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-lead-pipeline',
  imports: [ReactiveFormsModule, DecimalPipe, DragDropModule],
  template: `
    <div class="space-y-6 h-full flex flex-col">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-extrabold text-heading tracking-tight">Leads Pipeline</h2>
          <p class="text-subtle mt-1 text-sm">Track your opportunities from prospect to close</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex bg-inset rounded-lg p-1 border border-theme">
            <button (click)="viewMode.set('pipeline')" [class]="viewMode() === 'pipeline' ? 'bg-orange-500 text-black shadow-md' : 'text-muted hover:text-heading active:text-orange-500'" class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5" aria-label="Pipeline view">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
              Pipeline
            </button>
            <button (click)="viewMode.set('table')" [class]="viewMode() === 'table' ? 'bg-orange-500 text-black shadow-md' : 'text-muted hover:text-heading active:text-orange-500'" class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5" aria-label="Table view">
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
        <div class="flex-1 overflow-x-auto pb-2">
          <div class="flex gap-5 h-full" cdkDropListGroup>
            @for (col of columns; track col.key) {
              <div class="flex-1 min-w-[250px] card p-4 flex flex-col">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="font-semibold text-heading text-sm">{{ col.title }}</h3>
                  <span [class]="col.badgeClass">{{ getLeadsByStatus(col.key).length }}</span>
                </div>
                <div 
                  class="space-y-3 flex-1 min-h-[150px] rounded-lg"
                  cdkDropList
                  [id]="col.key"
                  [cdkDropListData]="getLeadsByStatus(col.key)"
                  (cdkDropListDropped)="onDrop($event)"
                >
                  @for (lead of getLeadsByStatus(col.key); track lead.id) {
                    <div 
                      cdkDrag 
                      [cdkDragData]="lead"
                      class="bg-inset p-4 rounded-lg border border-theme transition-all group cursor-grab active:cursor-grabbing hover:shadow-lg touch-action-none" 
                      [class.hover:border-emerald-500/40]="col.key === 'Won'" [class.hover:border-sky-500/40]="col.key === 'New'" [class.hover:border-amber-500/40]="col.key === 'Contacted'" [class.hover:border-violet-500/40]="col.key === 'Proposal Sent'">
                      <div class="flex justify-between items-start mb-2">
                        <span [class]="col.badgeClass + ' text-[10px]'">{{ lead.type }}</span>
                        <span class="text-[10px] text-faint">{{ lead.date }}</span>
                      </div>
                      <h4 class="font-semibold text-heading text-sm">{{ lead.title }}</h4>
                      <p class="text-xs text-subtle mt-0.5">{{ lead.company }}</p>
                      <div class="mt-3 flex justify-between items-center">
                        <span class="text-sm font-bold" [class]="col.key === 'Won' ? 'text-emerald-500' : 'text-orange-500'">\${{ lead.value | number }}</span>
                        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button (click)="openEditModal(lead)" class="p-1 text-subtle hover:text-orange-400 active:text-orange-500 rounded" aria-label="Edit"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                          <button (click)="deleteLead(lead.id)" class="p-1 text-subtle hover:text-red-400 active:text-red-500 rounded" aria-label="Delete"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                          @if (col.nextStatus) {
                            <button (click)="updateStatus(lead.id, col.nextStatus)" class="text-[10px] font-semibold text-subtle hover:text-orange-400 active:text-orange-500 ml-1">→</button>
                          }
                        </div>
                      </div>
                    </div>
                  }
                  @if (col.key === 'Won' && getLeadsByStatus('Won').length === 0) {
                    <div class="h-28 border-2 border-dashed border-theme rounded-lg flex items-center justify-center text-faint text-xs">No won deals yet</div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="flex-1 overflow-auto scrollbar-hidden">
          <div class="table-container">
            <table class="min-w-full divide-y divide-theme">
              <thead class="table-header">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Lead</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Company</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Type</th>
                  <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-muted uppercase tracking-wider">Value</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-subtle">
                @for (lead of leadService.leads(); track lead.id) {
                  <tr class="table-row transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-9 w-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-orange-500/20">{{ lead.title.charAt(0) }}</div>
                        <div class="ml-3">
                          <div class="text-sm font-semibold text-heading">{{ lead.title }}</div>
                          <div class="text-xs text-faint">{{ lead.date }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-muted">{{ lead.company }}</td>
                    <td class="px-6 py-4 whitespace-nowrap"><span class="badge bg-sky-500/15 text-sky-500 ring-1 ring-sky-500/30">{{ lead.type }}</span></td>
                    <td class="px-6 py-4 whitespace-nowrap text-right"><span class="text-sm font-bold text-orange-500">\${{ lead.value | number }}</span></td>
                    <td class="px-6 py-4 whitespace-nowrap"><span [class]="getStatusClass(lead.status)">{{ lead.status }}</span></td>
                    <td class="px-6 py-4 whitespace-nowrap text-right">
                      <div class="flex items-center gap-1 justify-end">
                        @if (lead.status !== 'Won') {
                          <button (click)="updateStatus(lead.id, getNextStatus(lead.status))" class="text-xs font-semibold text-orange-500 hover:text-orange-400 active:text-orange-500 px-2 py-1 hover:bg-orange-500/10 active:bg-orange-500/20 active:scale-95 rounded transition-all">→ {{ getNextStatus(lead.status) }}</button>
                        } @else { <span class="text-xs font-semibold text-emerald-500 px-2">✓ Won</span> }
                        <button (click)="openEditModal(lead)" class="p-2 text-muted hover:text-orange-400 active:text-orange-500 hover:bg-orange-500/10 active:bg-orange-500/20 active:scale-95 rounded-lg transition-all" aria-label="Edit"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                        <button (click)="deleteLead(lead.id)" class="p-2 text-muted hover:text-red-400 active:text-red-500 hover:bg-red-500/10 active:bg-red-500/20 active:scale-95 rounded-lg transition-all" aria-label="Delete"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="6" class="px-6 py-16 text-center text-subtle text-sm">No leads yet. Click "Add Lead" to get started.</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>

    @if (showModal()) {
      <div class="fixed inset-0 bg-overlay backdrop-blur-sm flex items-center justify-center z-50 modal-backdrop" (click)="closeModal()">
        <div class="rounded-xl p-8 max-w-lg w-full border border-theme shadow-2xl modal-panel" style="background:var(--modal-bg)" (click)="$event.stopPropagation()">
          <h3 class="text-xl font-bold text-heading mb-6">{{ editingLeadId() ? 'Edit Lead' : 'Add New Lead' }}</h3>
          <form [formGroup]="form" (ngSubmit)="saveLead()" class="space-y-5">
            <div>
              <label for="lead-title" class="form-label">Title *</label>
              <input formControlName="title" id="lead-title" type="text" class="form-input" placeholder="SEO Consultation">
              @if (form.get('title')?.touched && form.get('title')?.errors?.['required']) { <p class="field-error">Title is required</p> }
            </div>
            <div>
              <label for="lead-company" class="form-label">Company *</label>
              <input formControlName="company" id="lead-company" type="text" class="form-input" placeholder="Tech Startup LLC">
              @if (form.get('company')?.touched && form.get('company')?.errors?.['required']) { <p class="field-error">Company is required</p> }
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div><label for="lead-name" class="form-label">Contact</label><input formControlName="name" id="lead-name" type="text" class="form-input" placeholder="Alice"></div>
              <div>
                <label for="lead-email" class="form-label">Email</label><input formControlName="email" id="lead-email" type="email" class="form-input" placeholder="alice@co.com">
                @if (form.get('email')?.touched && form.get('email')?.errors?.['email']) { <p class="field-error">Invalid email</p> }
              </div>
              <div><label for="lead-phone" class="form-label">Phone</label><input formControlName="phone" id="lead-phone" type="tel" class="form-input" placeholder="555-987"></div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="lead-value" class="form-label">Value ($) *</label>
                <input formControlName="value" id="lead-value" type="number" class="form-input" placeholder="5000">
                @if (form.get('value')?.touched && form.get('value')?.errors?.['required']) { <p class="field-error">Value is required</p> }
                @if (form.get('value')?.touched && form.get('value')?.errors?.['min']) { <p class="field-error">Must be > 0</p> }
              </div>
              <div>
                <label for="lead-type" class="form-label">Type *</label>
                <input formControlName="type" id="lead-type" type="text" class="form-input" placeholder="Inbound">
                @if (form.get('type')?.touched && form.get('type')?.errors?.['required']) { <p class="field-error">Type is required</p> }
              </div>
            </div>
            @if (editingLeadId()) {
              <div>
                <label for="lead-status" class="form-label">Status</label>
                <select formControlName="status" id="lead-status" class="form-select">
                  <option value="New">New</option><option value="Contacted">Contacted</option><option value="Proposal Sent">Proposal Sent</option><option value="Won">Won</option><option value="Lost">Lost</option>
                </select>
              </div>
            }
            <div class="flex gap-3 pt-2">
              <button type="button" (click)="closeModal()" class="btn-secondary flex-1">Cancel</button>
              <button type="submit" [disabled]="form.invalid" class="btn-primary flex-1">{{ editingLeadId() ? 'Save Changes' : 'Add Lead' }}</button>
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

  columns = [
    { key: 'New' as Lead['status'], title: 'New Leads', badgeClass: 'badge bg-sky-500/15 text-sky-500 ring-1 ring-sky-500/30', nextStatus: 'Contacted' as Lead['status'] },
    { key: 'Contacted' as Lead['status'], title: 'Contacted', badgeClass: 'badge bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/30', nextStatus: 'Proposal Sent' as Lead['status'] },
    { key: 'Proposal Sent' as Lead['status'], title: 'Proposal Sent', badgeClass: 'badge bg-violet-500/15 text-violet-500 ring-1 ring-violet-500/30', nextStatus: 'Won' as Lead['status'] },
    { key: 'Won' as Lead['status'], title: 'Won', badgeClass: 'badge bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/30', nextStatus: null },
  ];

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required]], company: ['', [Validators.required]],
    name: [''], email: ['', [Validators.email]], phone: [''],
    value: [0, [Validators.required, Validators.min(1)]], type: ['', [Validators.required]],
    status: ['New' as Lead['status']],
  });

  getLeadsByStatus(status: Lead['status']): Lead[] {
    return this.leadService.leads().filter(l => l.status === status);
  }

  openAddModal() { this.editingLeadId.set(null); this.form.reset({ title: '', company: '', name: '', email: '', phone: '', value: 0, type: '', status: 'New' }); this.showModal.set(true); }
  openEditModal(lead: Lead) { this.editingLeadId.set(lead.id); this.form.patchValue({ title: lead.title, company: lead.company, name: (lead as any).name ?? '', email: (lead as any).email ?? '', phone: (lead as any).phone ?? '', value: lead.value, type: lead.type, status: lead.status }); this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }
  saveLead() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue(); const id = this.editingLeadId();
    id ? this.leadService.updateLead(id, v) : this.leadService.addLead(v);
    this.closeModal();
  }
  updateStatus(id: number, status: Lead['status']) { this.leadService.updateLeadStatus(id, status); }

  onDrop(event: CdkDragDrop<Lead[]>) {
    // Only handle cross-column drops since we aren't saving intra-column ordering
    if (event.previousContainer !== event.container) {
      const movedLead = event.item.data as Lead;
      const targetStatus = event.container.id as Lead['status'];
      this.updateStatus(movedLead.id, targetStatus);
    }
  }

  async deleteLead(id: number) {
    if (await this.popupService.confirm({ title: 'Delete Lead', message: 'Are you sure you want to delete this lead?', confirmText: 'Delete', cancelText: 'Cancel', type: 'danger' }))
      this.leadService.deleteLead(id);
  }
  getNextStatus(s: Lead['status']): Lead['status'] { return s === 'New' ? 'Contacted' : s === 'Contacted' ? 'Proposal Sent' : 'Won'; }
  getStatusClass(status: Lead['status']): string {
    switch (status) {
      case 'New': return 'badge bg-sky-500/15 text-sky-500 ring-1 ring-sky-500/30';
      case 'Contacted': return 'badge bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/30';
      case 'Proposal Sent': return 'badge bg-violet-500/15 text-violet-500 ring-1 ring-violet-500/30';
      case 'Won': return 'badge bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/30';
      default: return 'badge bg-gray-500/15 text-muted ring-1 ring-gray-500/30';
    }
  }
}
